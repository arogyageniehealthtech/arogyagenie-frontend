import  { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessageData } from '../../../patient/types/ai-chat.types';

export const ChatWindow = ({ messages }: { messages: ChatMessageData[] }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto p-4 scrollbar-hide">
      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};