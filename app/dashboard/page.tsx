import Link from "next/link";
import { getDashboardData } from "@/lib/actions";
import { formatKES, statusColor, statusLabel } from "@/lib/data";

function WeeklyTrendChart({
  weeklyTrend,
}: {
  weeklyTrend: { day: string; amount: number }[];
}) {
  const maxAmount = Math.max(...weeklyTrend.map((d) => d.amount), 1);
  const hasData = weeklyTrend.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <p className="mt-8 text-center text-sm text-gray-500">
        No collections this week yet. / Hakuna makusanyo bado wiki hii.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex h-40 items-end justify-between gap-2">
        {weeklyTrend.map((day) => {
          const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
          return (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                {day.amount > 0 ? `${(day.amount / 1000).toFixed(1)}k` : "0"}
              </span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-[#006532] transition-all hover:bg-[#004e27]"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={formatKES(day.amount)}
                />
              </div>
              <span className="text-xs text-gray-600">{day.day}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">
        Collections this week / Makusanyo ya wiki hii (KES)
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const { metrics, topDebtors, weeklyTrend, recentActivity } =
    await getDashboardData();

  const isEmpty =
    metrics.totalDebt === 0 &&
    metrics.debtorCount === 0 &&
    recentActivity.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#006532]">Shop Summary</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back. Here is your shop overview. /
            Karibu tena. Hii ndio muhtasari wa duka lako.
          </p>
        </div>
        <Link
          href="/add-debt"
          className="rounded-lg bg-[#006532] px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#004e27]"
        >
          + Record New Credit / Rekodi Deni
        </Link>
      </div>

      {isEmpty && (
        <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">
            No debts recorded yet / Hakuna deni zilizorekodiwa bado
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Start by recording your first customer credit. /
            Anza kwa kurekodi deni la kwanza la mteja.
          </p>
          <Link
            href="/add-debt"
            className="mt-4 inline-block rounded-lg bg-[#006532] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#004e27]"
          >
            + Record First Debt
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm border-t-4 border-t-[#006532]">
          <h2 className="text-sm font-medium text-gray-500">
            Total Debt / Deni Jumla
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatKES(metrics.totalDebt)}
          </p>
        </div>

        <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm border-t-4 border-t-[#D4AF37]">
          <h2 className="text-sm font-medium text-gray-500">
            Debtors / Wadeni
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {metrics.debtorCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm border-t-4 border-t-red-400">
          <h2 className="text-sm font-medium text-gray-500">
            Overdue Reminders / Ukumbusho Uliochelewa
          </h2>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {metrics.overdueCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm border-t-4 border-t-emerald-400">
          <h2 className="text-sm font-medium text-gray-500">
            Expected This Week / Inatarajiwa Wiki Hii
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatKES(metrics.expectedThisWeek)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-gray-900">
            Weekly Trend / Mwenendo wa Wiki
          </h2>
          <WeeklyTrendChart weeklyTrend={weeklyTrend} />
        </div>

        <div className="rounded-xl border border-[#D4AF37]/30 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900">
              Top Debtors / Wadeni Wakuu
            </h2>
            <Link
              href="/customers"
              className="text-sm font-medium text-[#006532] hover:underline"
            >
              View all
            </Link>
          </div>
          {topDebtors.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-500">
              No debtors yet. / Hakuna wadeni bado.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {topDebtors.map((debtor) => (
                <div
                  key={debtor.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <Link
                      href={`/customers/${debtor.id}`}
                      className="font-medium text-gray-900 hover:text-[#006532]"
                    >
                      {debtor.name}
                    </Link>
                    <p className="text-xs text-gray-500">{debtor.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatKES(debtor.amount)}
                    </p>
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor(debtor.status)}`}
                    >
                      {statusLabel(debtor.status).en}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#D4AF37]/30 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900">
            Recent Activity / Shughuli za Hivi Karibuni
          </h2>
        </div>
        {recentActivity.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">
            No activity yet. / Hakuna shughuli bado.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === "payment" ? "Payment from" : "Credit to"}{" "}
                    {activity.name}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <p
                  className={`font-bold ${activity.type === "payment" ? "text-[#006532]" : "text-gray-900"}`}
                >
                  {activity.type === "payment" ? "-" : "+"}
                  {formatKES(activity.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
