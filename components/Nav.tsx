"use client";

import Link from "next/link";
import { UserButton, SignInButton, Show } from "@clerk/nextjs";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/add-debt", label: "Add Debt" },
  { href: "/customers", label: "Customers" },
  { href: "/settings", label: "Settings" },
  { href: "/chat", label: "Chat" },
];

export function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006532] text-lg font-bold text-white shadow-sm">
            K
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-[#006532]">
            Kitabu ya Deni
          </Link>
        </div>

        {/* Desktop Links, Language, and Profile */}
        <div className="flex items-center gap-5 text-sm">
          
          {/* Main Navigation Links - HIDDEN ON MOBILE */}
          <div className="hidden items-center gap-4 md:flex">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="font-medium text-gray-600 transition-colors hover:text-[#006532]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Global Language Switcher - HIDDEN ON MOBILE */}
          <select 
            className="hidden cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-600 outline-none transition-all focus:ring-2 focus:ring-[#006532] md:block"
            aria-label="Select Language"
          >
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
            <option value="fr">Français</option>
            <option value="ar">العربية (Arabic)</option>
          </select>

          {/* Secure User Profile / Sign Out - HIDDEN ON MOBILE */}
          <div className="hidden md:block">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-md bg-[#006532] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#004e27]">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          {/* Mobile Hamburger Button - VISIBLE ONLY ON MOBILE */}
          <button 
            className="text-gray-600 hover:text-[#006532] focus:outline-none md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 w-full border-t border-gray-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-medium text-gray-600 transition-colors hover:text-[#006532]"
              >
                {link.label}
              </Link>
            ))}
            
            <select 
              className="w-full cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 outline-none transition-all focus:ring-2 focus:ring-[#006532]"
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
              <option value="fr">Français</option>
              <option value="ar">العربية (Arabic)</option>
            </select>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm font-medium text-gray-600">Account</span>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-md bg-[#006532] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#004e27]">
                    Sign In
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}