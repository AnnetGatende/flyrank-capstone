// app/add-debt/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addTransaction } from '@/lib/actions';
import { TransactionType } from '@prisma/client';

export default function AddDebtPage() {
  const router = useRouter();
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // File Upload State (UI only for now, cloud storage can be added later)
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      // Call the Server Action directly from the client
      await addTransaction({
        customerName,
        customerPhone,
        amount: parseFloat(amount),
        type: TransactionType.CREDIT,
        description
      });
      
      // On success, go back to the dashboard. 
      // The server action automatically revalidates the paths, so the new data will appear instantly.
      router.push('/dashboard'); 
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save the debt. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <button 
          onClick={() => router.push('/dashboard')} 
          className="text-sm font-medium text-[#006532] transition-colors hover:text-green-900"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Record New Credit</h2>
        
        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Customer / Client Name</label>
            <input 
              type="text" 
              required 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition-all focus:border-[#006532] focus:ring-1 focus:ring-[#006532]" 
              placeholder="e.g. Mama Wanjiku Shop" 
            />
          </div>

          {/* Customer Phone (Required for your database schema) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number (M-Pesa / SMS)</label>
            <input 
              type="text" 
              required 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition-all focus:border-[#006532] focus:ring-1 focus:ring-[#006532]" 
              placeholder="0712 345 678" 
            />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Amount (KES)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 font-medium text-gray-500">KES</span>
              <input 
                type="number" 
                required 
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-3 text-gray-900 outline-none transition-all focus:border-[#006532] focus:ring-1 focus:ring-[#006532]" 
                placeholder="0.00" 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              rows={3} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition-all focus:border-[#006532] focus:ring-1 focus:ring-[#006532]" 
              placeholder="Details of the goods or services provided (e.g., 2 bags of unga, 1 box of soap)..."
            ></textarea>
          </div>

          {/* Sleek File Upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Supporting Document (Optional)</label>
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <button 
                type="button"
                onClick={triggerFileInput}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#006532] focus:ring-offset-1"
              >
                Choose File
              </button>
              
              <div className="flex-1 truncate text-sm text-gray-500">
                {fileName ? (
                  <span className="flex items-center gap-2 text-[#006532] font-medium">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {fileName}
                  </span>
                ) : (
                  "No file chosen (Invoice, Receipt, etc.)"
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#006532] py-3 text-center font-medium text-white shadow-sm transition-colors hover:bg-[#004e27] disabled:opacity-70"
            >
              {isSubmitting ? 'Saving Entry...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}