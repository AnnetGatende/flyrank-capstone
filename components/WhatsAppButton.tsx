"use client";

import { buildWhatsAppUrl, formatKenyaPhone } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  phone,
  message,
  className = "",
  children = "Send via WhatsApp",
}: WhatsAppButtonProps) {
  const disabled = !phone.trim() || !message.trim();
  const href = disabled ? "#" : buildWhatsAppUrl(phone, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
      className={`inline-flex items-center justify-center rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      title={disabled ? undefined : `WhatsApp ${formatKenyaPhone(phone)}`}
    >
      {children}
    </a>
  );
}
