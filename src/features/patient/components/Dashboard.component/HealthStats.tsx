import React from 'react';
import { Pill, Video, FileText, Bot } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}

const StatCard = ({ icon, label, value, unit }: StatCardProps) => (
  <div className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-transparent bg-white p-5 text-center shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-100 hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.08)]">
    
   
    <div className="mb-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
      {icon}
    </div>
    
    <span className="mb-1 text-xs font-medium text-slate-500">{label}</span>
    
   
    <span className="text-2xl font-bold text-[#120F2F] transition-colors duration-300 group-hover:text-[#4F46E5]">
      {value}
    </span>
    
    <span className="text-[10px] font-medium text-slate-400">{unit}</span>
  </div>
);

export function HealthStats() {
  return (
    <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
      
      <StatCard 
        icon={<Pill size={24} className="text-[#F43F5E]" strokeWidth={2.5} />} 
        label="Active Meds" 
        value="3" 
        unit="prescriptions" 
      />
      
      
      <StatCard 
        icon={<Video size={24} className="text-[#0EA5E9]" strokeWidth={2.5} />} 
        label="Consultations" 
        value="1" 
        unit="upcoming" 
      />
    
      <StatCard 
        icon={<FileText size={24} className="text-[#10B981]" strokeWidth={2.5} />} 
        label="Lab Reports" 
        value="12" 
        unit="saved securely" 
      />
      
    
      <StatCard 
        icon={<Bot size={24} className="text-[#C084FC]" strokeWidth={2.5} />} 
        label="AI Checks" 
        value="5" 
        unit="this month" 
      />
    </div>
  );
}