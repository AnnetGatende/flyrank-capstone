"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Dashboard", labelSw: "Dashibodi", icon: "📊" },
  { href: "/customers", label: "Debtors", labelSw: "Wadeni", icon: "👥" },
  { href: "/add-debt", label: "Add Debt", labelSw: "Ongeza Deni", icon: "➕" },
  { href: "/sms-generator", label: "SMS Draft", labelSw: "Andika SMS", icon: "💬" },
  { href: "/chat", label: "AI Chat", labelSw: "Mazungumzo AI", icon: "🤖" },
  { href: "/settings", label: "Settings", labelSw: "Mipangilio", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // This entirely prevents the Next.js Hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Changed from an inline component to a standard variable to prevent render crashes
  const sidebarContent = (
    <>
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006532] text-lg font-bold text-white shadow-sm">
          K
        </div>
        <div>
          <p className="text-lg font-bold text-[#006532]">Kitabu ya Deni</p>
          <p className="text-xs text-gray-500">Digital Credit Ledger</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#006532] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#F5F1E8] hover:text-[#006532]"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>
                {item.label}
                <span className="block text-xs font-normal opacity-75">
                  {item.labelSw}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Auth Section placed at the bottom */}
      <div className="mt-auto border-t border-[#D4AF37]/20 pt-4 px-2">
        {/* Only render UserButton on the client, and explicitly force the redirect URL */}
        {isMounted && <UserButton afterSignOutUrl="/" showName={true} />}
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-md md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg className="h-5 w-5 text-[#006532]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#D4AF37]/20 bg-white p-4 shadow-lg transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}