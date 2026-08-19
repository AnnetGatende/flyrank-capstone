"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [shopName, setShopName] = useState("");
  const [paymentType, setPaymentType] = useState("Pochi la Biashara"); // New state
  const [paymentNumber, setPaymentNumber] = useState("");
  const [language, setLanguage] = useState("Kiswahili"); // Changed default to Swahili for local shops
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedShop = localStorage.getItem("shopName");
    if (savedShop) setShopName(savedShop);
    
    const savedPayType = localStorage.getItem("paymentType");
    if (savedPayType) setPaymentType(savedPayType);

    const savedPayNum = localStorage.getItem("paymentNumber");
    if (savedPayNum) setPaymentNumber(savedPayNum);
    
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    localStorage.setItem("shopName", shopName);
    localStorage.setItem("paymentType", paymentType);
    localStorage.setItem("paymentNumber", paymentNumber);
    localStorage.setItem("language", language);

    setTimeout(() => {
      setIsSaving(false);
      setMessage("Mipangilio imehifadhiwa! (Settings saved!)");
      setTimeout(() => setMessage(""), 3000);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your shop profile and M-Pesa details.</p>
      </div>

      <form onSubmit={handleSave} className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Shop Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Shop Name</label>
              <input 
                type="text" 
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]" 
                placeholder="e.g. Mama Wanjiku Kiosk"
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Payment Method</label>
                <select 
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]"
                >
                  <option value="Pochi la Biashara">Pochi la Biashara</option>
                  <option value="Till Number">Buy Goods (Till)</option>
                  <option value="Paybill Number">Paybill</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Number</label>
                <input 
                  type="text" 
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]" 
                  placeholder="e.g. 0712345678"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">AI & SMS</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Default SMS Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]"
              >
                <option value="Kiswahili">Kiswahili</option>
                <option value="Sheng">Sheng</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between rounded-b-xl bg-gray-50 p-6">
           <p className="text-sm font-medium text-[#006532]">{message}</p>
           <button 
             type="submit" 
             disabled={isSaving}
             className="rounded-lg bg-[#006532] px-6 py-2 font-medium text-white transition-colors hover:bg-[#004e27] disabled:opacity-50"
           >
             {isSaving ? "Saving..." : "Save Changes"}
           </button>
        </div>
      </form>
    </div>
  );
}