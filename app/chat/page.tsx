import { ChatAssistant } from '@/components/ChatAssistant';

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-xl font-semibold mb-4">Kitabu ya Deni Assistant</h1>
      <ChatAssistant />
    </main>
  );
}