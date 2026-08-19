"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = (input ?? "").trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#006532]">
          Kitabu ya Deni Assistant
        </h1>
        <p className="text-sm text-gray-600">
          Ask the AI to draft payment reminders or analyze your debts. /
          Uliza AI kuandika ukumbusho wa malipo au kuchambua deni zako.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.message || "Something went wrong. Tafadhali jaribu tena."}
        </div>
      )}

      <div className="flex h-[600px] max-h-[75vh] flex-col overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-white shadow-sm">
        <div className="flex-1 overflow-y-auto bg-[#F5F1E8] p-6 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center max-w-sm">
                <p className="text-lg font-semibold text-[#006532]">Jambo! 👋</p>
                <p className="mt-2 text-sm text-gray-600">
                  I am your shop assistant. / Mimi ni msaidizi wa duka lako.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600 text-left inline-block">
                  <li>• Draft polite payment reminder SMSes / Andika SMS za ukumbusho</li>
                  <li>• Analyze your weekly debts / Chambua deni za wiki</li>
                  <li>• Suggest collection strategies / Pendekeza mikakati ya ukusanyaji</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  message.role === "user" ? "bg-gray-800" : "bg-[#006532]"
                }`}
              >
                {message.role === "user" ? "You" : "AI"}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm border whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-gray-800 text-white border-gray-800 rounded-tr-none"
                    : "bg-white text-gray-700 border-gray-100 rounded-tl-none"
                }`}
              >
                {getMessageText(message)}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006532] text-xs font-bold text-white">
                AI
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-gray-100 bg-white p-4 text-sm text-gray-500 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#D4AF37] [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#D4AF37] [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#D4AF37]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-[#D4AF37]/20 bg-white p-4">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="E.g., Draft a Swahili SMS to remind John of his debt..."
              className="flex-1 rounded-lg border border-gray-300 p-3 text-sm text-gray-900 outline-none focus:border-[#006532] focus:ring-1 focus:ring-[#006532]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !(input ?? "").trim()}
              className="rounded-lg bg-[#006532] px-6 py-3 font-medium text-white transition-colors hover:bg-[#004e27] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
