// src/features/dashboard/components/AiHealthInsight.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ChevronRight } from 'lucide-react';

export const AiHealthInsight: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    window.dispatchEvent(new Event('open-ai-assistant')); 
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-3xl p-5 border border-slate-200 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 mt-5 flex items-center justify-between mb-24 lg:mb-6 relative overflow-hidden cursor-pointer"
    >

      <div className="absolute right-0 top-0 w-32 h-32 bg-purple-50/80 group-hover:bg-purple-100 transition-colors duration-500 rounded-full blur-2xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
      
      <div className="relative z-10 pr-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
            ArogyaGenie AI
          </span>
        </div>
        <h3 className="font-bold text-[#1E293B] text-[15px] mb-1 group-hover:text-purple-700 transition-colors duration-300 flex items-center gap-1">
          Chat with AI Health Assistant
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </h3>
        <p className="text-xs text-slate-500 max-w-55 leading-relaxed font-medium">
          Your sleep quality improved by 12% compared to last week. Ask AI for custom insights!
        </p>
      </div>
      

      <div className="relative z-10 shrink-0 transform group-hover:scale-110 transition-transform duration-300">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 relative flex items-center justify-center shadow-inner">
           <Bot className="w-8 h-8 text-purple-700" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};