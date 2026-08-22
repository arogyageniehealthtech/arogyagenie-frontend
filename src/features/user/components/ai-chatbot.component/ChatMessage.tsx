import type { ChatMessageData } from '../../../patient/types/ai-chat.types';

export const ChatMessage = ({ message }: { message: ChatMessageData }) => {
  const isAi = message.type === 'ai';
  return (
    <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
        isAi 
          ? 'bg-[#081633] border border-white/5 text-slate-200 rounded-bl-none shadow-lg' 
          : 'bg-linear-to-r from-[#6D28D9] to-[#4F46E5] text-white rounded-br-none shadow-[0_5px_15px_rgba(109,40,217,0.3)]'
      }`}>
        {message.message}
      </div>
    </div>
  );
};