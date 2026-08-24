import { useState } from 'react';
import { AiChatHeader } from '../components/ai-chatbot.component/AiChatHeader';
import { ChatWindow } from '../components/ai-chatbot.component/ChatWindow';
import { QuickSuggestion } from '../components/ai-chatbot.component/QuickSuggestion';
import { ChatInput } from '../components/ai-chatbot.component/ChatInput';
import type { ChatMessageData } from '../../patient/types/ai-chat.types';

export default function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    { id: '1', type: 'ai', message: "Hello! I'm your AI health assistant. How can I help you today?", timestamp: '10:00 AM' }
  ]);

  const handleSendMessage = (text: string) => {
    const newUserMsg: ChatMessageData = { id: Date.now().toString(), type: 'user', message: text };
    setMessages(prev => [...prev, newUserMsg]);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        type: 'ai', 
        message: "Thanks for sharing that. I'll help you understand your symptoms better." 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#030A1C] text-white font-sans overflow-hidden">
      
      <AiChatHeader />
      
      <div className="flex-1 overflow-hidden flex flex-col px-4 md:px-8 pb-6">
        <ChatWindow messages={messages} />
        
        <div className="mt-4 shrink-0">
          <QuickSuggestion onSelect={handleSendMessage} />
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}