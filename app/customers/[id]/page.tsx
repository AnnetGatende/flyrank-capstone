import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/actions";
import { CustomerPaymentForm } from "@/components/CustomerPaymentForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { EditableTransactionRow } from "@/components/EditableTransactionRow";
import { formatKES, statusColor, statusLabel } from "@/lib/data";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const reminderMessage = `Habari ${customer.name}, tunakukumbusha deni lako la ${formatKES(customer.totalDebt)}. Tafadhali lipa kadri uwezavyo. Asante!`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="mb-6">
        <Link
          href="/customers"
          className="text-sm font-medium text-[#006532] transition-colors hover:text-green-900"
        >
          &larr; Back to Customers / Rudi kwa Wateja
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-sm text-gray-500">
            Phone / Simu: {customer.phone}
          </p>
          <span
            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusColor(customer.status)}`}
          >
            {statusLabel(customer.status).en} /{" "}
            {statusLabel(customer.status).sw}
          </span>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm font-medium text-gray-500">
            Total Outstanding / Deni Jumla
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {formatKES(customer.totalDebt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {customer.totalDebt > 0 && (
          <div className="flex-1 min-w-[280px]">
            <CustomerPaymentForm
              customerId={customer.id}
              maxAmount={customer.totalDebt}
            />
          </div>
        )}
        <div className="flex flex-col justify-center gap-2">
          <WhatsAppButton phone={customer.phone} message={reminderMessage}>
            💬 Send via WhatsApp / Tuma kwa WhatsApp
          </WhatsAppButton>
          <Link
            href={`/sms-generator?name=${encodeURIComponent(customer.name)}&amount=${customer.totalDebt}&phone=${encodeURIComponent(customer.phone)}&status=${customer.status}`}
            className="rounded-lg border border-[#D4AF37] bg-[#F5F1E8] px-4 py-2 text-center text-sm font-medium text-[#006532] transition-colors hover:bg-[#D4AF37]/20"
          >
            ✨ Draft AI SMS / Andika SMS na AI
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-[#F5F1E8] px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Transaction History / Historia ya Miamala
          </h2>
        </div>

        {customer.transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions yet. / Hakuna miamala bado.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {customer.transactions.map((tx) => (
              <EditableTransactionRow 
                key={tx.id} 
                tx={tx} 
                formattedAmount={formatKES(tx.amount)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}