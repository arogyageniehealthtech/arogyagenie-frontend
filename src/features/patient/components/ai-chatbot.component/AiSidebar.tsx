
import { MessageCircle, Activity, HeartPulse, Pill, FileText } from 'lucide-react';

export const AiSidebar = () => {
  const items = [
    { icon: MessageCircle, label: 'Chat', active: true },
    { icon: Activity, label: 'Symptoms' },
    { icon: HeartPulse, label: 'Tips' },
    { icon: Pill, label: 'Meds' },
    { icon: FileText, label: 'Records' },
  ];

  return (
    <nav className="w-20 hidden md:flex flex-col items-center py-8 bg-[#06112B] border-r border-white/5 gap-8">
      {items.map((item, i) => (
        <button 
          key={i} 
          className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
            item.active ? 'bg-linear-to-br from-[#6D28D9] to-[#4F46E5] shadow-[0_0_15px_rgba(109,40,217,0.5)]' : 'text-slate-500 hover:text-white'
          }`}
        >
          <item.icon size={24} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};