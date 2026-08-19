// lib/whatsapp.ts

export function formatKenyaPhone(phone: string): string {
  // WhatsApp requires omitting brackets, dashes, plus signs, and leading zeros.
  // This regex removes all non-numeric characters.
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `254${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `254${digits}`;
  }

  return digits;
}

// Export an alias in case other files are still importing the previous function name
export const formatKenyanPhone = formatKenyaPhone;

export function buildWhatsAppUrl(phone: string, message: string): string {
  const formatted = formatKenyaPhone(phone);
  // Universal links use wa.me followed by the international number and the URL-encoded pre-filled message.
  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
}

// Export an alias for backward compatibility
export const getWhatsAppUrl = buildWhatsAppUrl;

export function openWhatsApp(phone: string, message: string): void {
  if (!phone.trim() || !message.trim()) return;
  
  const url = buildWhatsAppUrl(phone, message);
  
  // Safeguard to prevent Next.js Server-Side Rendering (SSR) crashes
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}