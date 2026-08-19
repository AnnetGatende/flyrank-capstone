"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionType } from "@prisma/client";
import { addTransaction } from "@/lib/actions";

interface CustomerPaymentFormProps {
  customerId: string;
  maxAmount: number;
}

export function CustomerPaymentForm({
  customerId,
  maxAmount,
}: CustomerPaymentFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [mpesaRef, setMpesaRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Enter a valid amount. / Weka kiasi sahihi.");
      return;
    }
    if (value > maxAmount) {
      setError("Payment exceeds outstanding balance.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addTransaction({
        customerId,
        amount: value,
        type: TransactionType.PAYMENT,
        description: description.trim() || "Kidogo kidogo payment",
        mpesaRef: mpesaRef.trim() || undefined,
      });
      setAmount("");
      setDescription("");
      setMpesaRef("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save payment");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-[#D4AF37]/30 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">
        Log Payment / Rekodi Malipo
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (KES)"
          className="rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]"
          required
        />
        <input
          type="text"
          value={mpesaRef}
          onChange={(e) => setMpesaRef(e.target.value)}
          placeholder="M-Pesa ref (optional)"
          className="rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]"
        />
      </div>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description / Maelezo"
        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#006532] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#004e27] disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Payment / Hifadhi Malipo"}
      </button>
    </form>
  );
}
