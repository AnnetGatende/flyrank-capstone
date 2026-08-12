'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export function ChatAssistant() {
  const { messages, sendMessage, status, stop } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPinnedToBottom = useRef(true);
const [showJumpButton, setShowJumpButton] = useState(false);

  const isStreaming = status === 'streaming';
  const isSubmitting = status === 'submitted';

  function handleScroll() {
  const el = scrollRef.current;
  if (!el) return;
  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  const pinned = distanceFromBottom < 40;
  isPinnedToBottom.current = pinned;
  setShowJumpButton(!pinned);
}

  useEffect(() => {
    if (isPinnedToBottom.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming || isSubmitting) return;
    sendMessage({ text: input });
    setInput('');
    isPinnedToBottom.current = true;
    setShowJumpButton(false);
  }

  function jumpToLatest() {
    isPinnedToBottom.current = true;
    setShowJumpButton(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[85vh] w-full max-w-lg mx-auto border rounded-lg overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}
            >
              {message.parts.map((part, i) =>
                part.type === 'text' ? <span key={i}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}

        {isSubmitting && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-gray-500">
              <ThinkingDots />
            </div>
          </div>
        )}
      </div>

      {showJumpButton && (
        <button
          onClick={jumpToLatest}
          className="mx-auto mb-2 text-xs bg-gray-800 text-white px-3 py-1 rounded-full"
        >
          Jump to latest ↓
        </button>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask about logging debts, payments, or trust scores..."
          rows={1}
          className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm text-base sm:text-sm"
          style={{ fontSize: '16px' }}
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="shrink-0 rounded-lg bg-red-600 text-white px-4 py-2 text-sm"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || isSubmitting}
            className="shrink-0 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm disabled:opacity-40"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="animate-bounce [animation-delay:-0.3s]">●</span>
      <span className="animate-bounce [animation-delay:-0.15s]">●</span>
      <span className="animate-bounce">●</span>
    </span>
  );
}