// app/sms-generator/page.tsx
"use client";

import { useState } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function SmsGeneratorPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Overdue");
  const [language, setLanguage] = useState("Kiswahili");
  const [smsDraft, setSmsDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerateAI = async () => {
    if (!name || !amount) return setErrorMsg("Name and Amount are required.");
    setLoading(true);
    setErrorMsg("");
    const shopName = localStorage.getItem("shopName") || "My Shop";

    // Convert frontend language selection to the codes your backend expects
    const langCode = language === "Kiswahili" ? "sw" : "en";

    try {
      // 1. Point to the correct SMS API route
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 2. Send the exact payload structure your backend asks for
        body: JSON.stringify({
          debtorName: name,
          amount: amount,
          shopName: shopName,
          dueStatus: status,
          language: langCode,
        }),
      });

      // 3. Parse the JSON response
      const data = await res.json();

      if (!res.ok) {
        // This will catch your specific backend errors (like missing API key)
        throw new Error(data.error || "Failed to generate");
      }
      
      // 4. Extract just the text from the JSON and put it in the box
      setSmsDraft(data.sms);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate SMS.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    // Uses your lib/whatsapp.ts to properly open WhatsApp Web!
    if (smsDraft && phone) window.open(getWhatsAppUrl(phone, smsDraft), "_blank");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-900">SMS Draft Generator</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border p-2.5 outline-none focus:border-[#006532]" />
          <input type="text" placeholder="Phone Number (e.g. 0712345678)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border p-2.5 outline-none focus:border-[#006532]" />
          <input type="number" placeholder="Amount (KES)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-lg border p-2.5 outline-none focus:border-[#006532]" />
          <button onClick={handleGenerateAI} disabled={loading} className="w-full rounded-lg bg-[#006532] py-3 text-white font-medium hover:bg-[#004e27] disabled:opacity-50">
            {loading ? "Generating..." : "✨ Generate AI Draft"}
          </button>
          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        </div>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <textarea rows={8} value={smsDraft} onChange={(e) => setSmsDraft(e.target.value)} placeholder="Draft will appear here..." className="w-full rounded-lg border p-3 outline-none focus:border-[#006532]" />
          <button onClick={handleOpenWhatsApp} disabled={!smsDraft || !phone} className="w-full rounded-lg bg-[#25D366] py-3 text-white font-medium hover:bg-[#1ebd59] disabled:opacity-50">
            💬 Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}