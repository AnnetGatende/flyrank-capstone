import Link from "next/link";
import { getCustomers } from "@/lib/actions";
import { formatKES, statusColor, statusLabel } from "@/lib/data";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#006532]">Debtor List</h1>
          <p className="text-sm text-gray-600">
            Manage clients and outstanding balances. /
            Simamia wateja na salio la deni.
          </p>
        </div>
        <Link
          href="/add-debt"
          className="rounded-lg bg-[#006532] px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#004e27]"
        >
          + Add Debt / Ongeza Deni
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">
            No customers yet / Hakuna wateja bado
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Record your first debt to get started. /
            Rekodi deni la kwanza kuanza.
          </p>
          <Link
            href="/add-debt"
            className="mt-4 inline-block rounded-lg bg-[#006532] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#004e27]"
          >
            + Add First Debt
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-white shadow-sm">
          {/* Note: I widened the action column slightly here to fit two buttons */}
          <div className="hidden border-b border-gray-100 bg-[#F5F1E8] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] md:gap-4">
            <span>Name / Jina</span>
            <span>Phone / Simu</span>
            <span>Amount / Kiasi</span>
            <span>Status / Hali</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col gap-4 p-5 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] md:items-center md:gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006532]/10 text-sm font-bold text-[#006532]">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-semibold text-gray-900 hover:text-[#006532]"
                    >
                      {customer.name}
                    </Link>
                    <p className="text-xs text-gray-500 md:hidden">
                      {customer.phone}
                    </p>
                  </div>
                </div>

                <span className="hidden text-sm text-gray-600 md:block">
                  {customer.phone}
                </span>

                <span className="text-lg font-bold text-gray-900 md:text-base">
                  {formatKES(customer.amount)}
                </span>

                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${statusColor(customer.status)}`}
                >
                  {statusLabel(customer.status).en} /{" "}
                  {statusLabel(customer.status).sw}
                </span>

                {/* NEW: Action buttons grouped together */}
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="rounded-lg bg-[#006532] px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-[#004e27]"
                  >
                    👀 View
                  </Link>
                  <Link
                    href={`/sms-generator?name=${encodeURIComponent(customer.name)}&amount=${customer.amount}&phone=${encodeURIComponent(customer.phone)}&status=${customer.status}`}
                    className="rounded-lg border border-[#D4AF37] bg-[#F5F1E8] px-3 py-2 text-center text-xs font-medium text-[#006532] transition-colors hover:bg-[#D4AF37]/20"
                  >
                    💬 SMS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}