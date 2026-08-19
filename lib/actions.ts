"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { derivePaymentStatus, type PaymentStatus } from "@/lib/data";

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

function customerStatus(
  totalBalance: Prisma.Decimal,
  oldestCreditDate?: Date | null
): PaymentStatus {
  return derivePaymentStatus(totalBalance.toNumber(), oldestCreditDate);
}

export async function getCustomers() {
  const userId = await requireUserId();

  const customers = await prisma.customer.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      transactions: {
        where: { type: TransactionType.CREDIT },
        orderBy: { date: "asc" },
        take: 1,
      },
    },
  });

  return customers.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    amount: c.totalBalance.toNumber(),
    status: customerStatus(c.totalBalance, c.transactions[0]?.date ?? null),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function getCustomerById(customerId: string) {
  const userId = await requireUserId();

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, userId },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!customer) return null;

  const oldestCredit = customer.transactions.find(
    (t) => t.type === TransactionType.CREDIT
  );

  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    totalDebt: customer.totalBalance.toNumber(),
    status: customerStatus(
      customer.totalBalance,
      oldestCredit?.date ?? null
    ),
    transactions: customer.transactions.map((t) => ({
      id: t.id,
      date: t.date.toISOString(),
      type: t.type.toLowerCase() as "credit" | "payment",
      amount: t.amount.toNumber(),
      description: t.description,
      mpesaRef: t.mpesaRef,
    })),
  };
}

export async function upsertCustomer(input: {
  name: string;
  phone: string;
}) {
  const userId = await requireUserId();
  const phone = input.phone.trim();
  const name = input.name.trim();

  if (!name || !phone) {
    throw new Error("Name and phone are required");
  }

  const customer = await prisma.customer.upsert({
    where: {
      userId_phone: { userId, phone },
    },
    update: { name },
    create: {
      userId,
      name,
      phone,
      totalBalance: new Prisma.Decimal(0),
    },
  });

  revalidatePath("/customers");
  revalidatePath("/dashboard");

  return customer;
}

export async function addTransaction(input: {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  amount: number;
  type: TransactionType;
  description?: string;
  mpesaRef?: string;
  date?: Date;
}) {
  const userId = await requireUserId();

  if (!input.amount || input.amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const amount = new Prisma.Decimal(input.amount);

  return prisma.$transaction(async (tx) => {
    let customerId = input.customerId;

    if (!customerId) {
      if (!input.customerName?.trim() || !input.customerPhone?.trim()) {
        throw new Error("Customer name and phone are required for new debts");
      }

      const customer = await tx.customer.upsert({
        where: {
          userId_phone: {
            userId,
            phone: input.customerPhone.trim(),
          },
        },
        update: {
          name: input.customerName.trim(),
        },
        create: {
          userId,
          name: input.customerName.trim(),
          phone: input.customerPhone.trim(),
          totalBalance: new Prisma.Decimal(0),
        },
      });

      customerId = customer.id;
    }

    const customer = await tx.customer.findFirst({
      where: { id: customerId, userId },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const delta =
      input.type === TransactionType.CREDIT ? amount : amount.negated();

    const nextBalance = customer.totalBalance.add(delta);

    if (nextBalance.lessThan(0)) {
      throw new Error("Payment exceeds outstanding balance");
    }

    const transaction = await tx.transaction.create({
      data: {
        userId,
        customerId: customer.id,
        amount,
        type: input.type,
        description: input.description?.trim() || null,
        mpesaRef: input.mpesaRef?.trim() || null,
        date: input.date ?? new Date(),
      },
    });

    await tx.customer.update({
      where: { id: customer.id },
      data: { totalBalance: nextBalance },
    });

    revalidatePath("/customers");
    revalidatePath("/dashboard");
    revalidatePath(`/customers/${customer.id}`);
    revalidatePath("/add-debt");

    return {
      id: transaction.id,
      customerId: customer.id,
    };
  });
}

export async function getDashboardData() {
  const userId = await requireUserId();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const [customers, recentTransactions, weekPayments] = await Promise.all([
    prisma.customer.findMany({
      where: { userId },
      include: {
        transactions: {
          where: { type: TransactionType.CREDIT },
          orderBy: { date: "asc" },
          take: 1,
        },
      },
      orderBy: { totalBalance: "desc" },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
      include: { customer: { select: { name: true } } },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.PAYMENT,
        date: { gte: weekAgo },
      },
    }),
  ]);

  const totalDebt = customers.reduce(
    (sum, c) => sum.add(c.totalBalance),
    new Prisma.Decimal(0)
  );

  const debtorCount = customers.filter((c) =>
    c.totalBalance.greaterThan(0)
  ).length;

  let overdueCount = 0;
  let expectedThisWeek = new Prisma.Decimal(0);

  const enrichedCustomers = customers.map((c) => {
    const oldestCredit = c.transactions[0]?.date ?? null;
    const status = customerStatus(c.totalBalance, oldestCredit);
    if (status === "overdue") overdueCount += 1;
    if (status === "due") expectedThisWeek = expectedThisWeek.add(c.totalBalance);
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      amount: c.totalBalance.toNumber(),
      status,
    };
  });

  const topDebtors = enrichedCustomers
    .filter((c) => c.amount > 0)
    .slice(0, 5);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);

    const amount = weekPayments
      .filter((p) => p.date >= d && p.date < nextDay)
      .reduce((sum, p) => sum + p.amount.toNumber(), 0);

    return { day: dayLabels[d.getDay()], amount };
  });

  const recentActivity = recentTransactions.map((t) => ({
    id: t.id,
    type: t.type === TransactionType.PAYMENT ? ("payment" as const) : ("credit" as const),
    name: t.customer.name,
    amount: t.amount.toNumber(),
    time: t.date.toLocaleString("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  }));

  return {
    metrics: {
      totalDebt: totalDebt.toNumber(),
      debtorCount,
      overdueCount,
      expectedThisWeek: expectedThisWeek.toNumber(),
    },
    topDebtors,
    weeklyTrend,
    recentActivity,
  };
}


export async function updateTransactionDescription(
  transactionId: string,
  newDescription: string
) {
  const userId = await requireUserId();

  // 1. Verify the transaction exists and belongs to the logged-in shopkeeper
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    throw new Error("Transaction not found or unauthorized");
  }

  // 2. Update the description in the database
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { description: newDescription.trim() || null },
  });

  // 3. Force Next.js to instantly update the screen with the new text
  revalidatePath(`/customers/${transaction.customerId}`);
  revalidatePath("/dashboard");
  revalidatePath("/customers");

  return { success: true };
}