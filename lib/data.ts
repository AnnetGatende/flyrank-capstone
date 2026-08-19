export type PaymentStatus = "due" | "overdue" | "paid" | "pending";

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}

export function statusLabel(status: PaymentStatus): { en: string; sw: string } {
  const labels: Record<PaymentStatus, { en: string; sw: string }> = {
    due: { en: "Due Soon", sw: "Inakaribia" },
    overdue: { en: "Overdue", sw: "Imechelewa" },
    paid: { en: "Paid", sw: "Imelipwa" },
    pending: { en: "Pending", sw: "Inasubiri" },
  };
  return labels[status];
}

export function statusColor(status: PaymentStatus): string {
  switch (status) {
    case "overdue":
      return "bg-red-50 text-red-700 border-red-200";
    case "due":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function derivePaymentStatus(
  totalBalance: number,
  oldestCreditDate?: Date | null
): PaymentStatus {
  if (totalBalance <= 0) return "paid";

  if (oldestCreditDate) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (oldestCreditDate < weekAgo) return "overdue";
  }

  return totalBalance > 0 ? "due" : "pending";
}
