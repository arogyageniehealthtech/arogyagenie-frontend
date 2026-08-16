import { useState } from 'react';
import { ChatWindow } from '../components/ai-chatbot.component/ChatWindow';
import { QuickSuggestion } from '../components/ai-chatbot.component/QuickSuggestion';
import { ChatInput } from '../components/ai-chatbot.component/ChatInput';
import type { ChatMessageData } from '../types/ai-chat.types';

export default function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    { id: '1', type: 'ai', message: "Hello! I'm ArogyaGenie. How can I assist you with your health today?", timestamp: '10:00 AM' }
  ]);

  const handleSendMessage = (text: string) => {
    const newUserMsg: ChatMessageData = { id: Date.now().toString(), type: 'user', message: text };
    setMessages(prev => [...prev, newUserMsg]);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        type: 'ai', 
        message: "I understand. Let's look into that. Could you provide a bit more detail?" 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] lg:h-[calc(100vh-140px)] w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden my-4">
      
      
      <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-sm">ArogyaGenie AI</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Online & Ready</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} />
      </div>
      
    
      <div className="px-6 pb-4 pt-2 bg-white shrink-0 border-t border-slate-50">
        <QuickSuggestion onSelect={handleSendMessage} />
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}