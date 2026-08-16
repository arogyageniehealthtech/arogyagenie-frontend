
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export const AiChatHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="px-6 py-4 border-b border-white/5 flex items-center gap-4 shrink-0">
      <button 
        onClick={() => navigate(-1)} 
        className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
        aria-label="Go back"
      >
        <ArrowLeft size={22} />
      </button>
      
      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#6D28D9] to-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
        <span className="text-lg">🤖</span>
      </div>
      
      <div>
        <h1 className="text-sm font-bold text-white">ArogyaGenie AI</h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Online & Ready</p>
      </div>
    </header>
  );
};