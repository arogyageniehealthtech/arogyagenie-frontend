import  { useState } from 'react';
import { Send } from 'lucide-react';

export const ChatInput = ({ onSend }: { onSend: (t: string) => void }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="relative flex items-center bg-[#06112B] rounded-full p-2 border border-[#8B5CF6]/30 focus-within:ring-2 focus-within:ring-[#8B5CF6]/50">
      <input 
        className="flex-1 bg-transparent px-4 py-3 outline-none text-sm text-white placeholder:text-slate-500"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button 
        onClick={handleSubmit}
        className="bg-[#6D28D9] p-3 rounded-full hover:bg-[#7C3AED] transition-colors"
      >
        <Send size={18} />
      </button>
    </div>
  );
};