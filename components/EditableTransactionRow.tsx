"use client";

import { useState } from "react";
import { updateTransactionDescription } from "@/lib/actions";

export function EditableTransactionRow({ 
  tx, 
  formattedAmount 
}: { 
  tx: any; 
  formattedAmount: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(tx.description || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (description.trim() === tx.description) {
      setIsEditing(false); // No changes made
      return;
    }
    
    setIsSaving(true);
    try {
      await updateTransactionDescription(tx.id, description);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update description", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col justify-between p-6 sm:flex-row sm:items-center">
      <div>
        {isEditing ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border border-[#D4AF37] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#006532]"
              placeholder="e.g. Unga, Sukari, Milk"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded bg-[#006532] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[#004e27] disabled:opacity-50"
            >
              {isSaving ? "..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">
              {tx.description || (tx.type === "credit" ? "Credit" : "Payment")}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-gray-400 transition-colors hover:text-[#006532]"
              title="Edit Description"
            >
              ✏️ Edit
            </button>
          </div>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {new Date(tx.date).toLocaleDateString("en-KE", {
            dateStyle: "medium",
          })}
          {tx.mpesaRef && ` · M-Pesa: ${tx.mpesaRef}`}
        </p>
      </div>
      
      <div className="mt-2 text-left sm:mt-0 sm:text-right">
        <span className={`font-bold ${tx.type === "credit" ? "text-gray-900" : "text-[#006532]"}`}>
          {tx.type === "credit" ? "+" : "-"}
          {formattedAmount}
        </span>
        <p className="text-xs capitalize text-gray-500">{tx.type}</p>
      </div>
    </div>
  );
}