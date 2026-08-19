import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AppProviders } from "@/components/AppProviders";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Import Show instead of SignedIn/SignedOut
import { Show, RedirectToSignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Kitabu ya Deni",
  description: "Digital credit ledger for small shop owners / Daftari la deni la kidijitali",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F1E8] font-sans text-gray-900">
        <AppProviders>
          
          {/* WHAT HAPPENS WHEN THE USER IS LOGGED IN */}
          <Show when="signed-in">
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 md:ml-64">
                <div className="mx-auto max-w-5xl px-4 py-8 pt-16 md:pt-8">
                  <ErrorBoundary>{children}</ErrorBoundary>
                </div>
              </main>
            </div>
          </Show>

          {/* WHAT HAPPENS WHEN THE USER IS LOGGED OUT */}
          <Show when="signed-out">
            <RedirectToSignIn />
          </Show>

        </AppProviders>
      </body>
    </html>
  );
}