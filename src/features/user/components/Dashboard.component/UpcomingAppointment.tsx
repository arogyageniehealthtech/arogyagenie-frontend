// src/features/dashboard/components/UpcomingAppointment.tsx
import React from 'react';
import { Calendar } from 'lucide-react';

export const UpcomingAppointment: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-[#1E293B] text-[15px]">Upcoming Appointment</h3>
        <button className="text-[#4F46E5] text-xs font-bold hover:underline">View All</button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80" 
            alt="Dr. Sarah Johnson" 
            className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shadow-sm"
          />
          <div>
            <h4 className="font-bold text-[#1E293B] text-sm mb-0.5">Dr. Sarah Johnson</h4>
            <p className="text-xs text-slate-500 font-medium">Cardiologist</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
              May 24, 2025 <span className="w-1 h-1 rounded-full bg-slate-300"></span> 10:30 AM
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              CarePlus Hospital
            </p>
          </div>
        </div>
        <div className="bg-indigo-50/80 p-3 rounded-2xl text-[#4F46E5] self-start mt-1 cursor-pointer hover:bg-indigo-100 hover:scale-105 transition-all">
          <Calendar size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};