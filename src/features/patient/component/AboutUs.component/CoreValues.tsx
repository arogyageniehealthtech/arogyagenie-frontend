import React from 'react';
import { Bot, Stethoscope, Clock } from 'lucide-react';

const CORE_VALUES_DATA = [
  {
    icon: <Bot className="w-8 h-8 text-indigo-500" />,
    title: "AI-Powered Insights",
    description: "Our advanced AI constantly monitors your health trends, providing proactive advice before issues arise.",
    bg: "bg-indigo-50",
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-emerald-500" />,
    title: "Top-Tier Doctors",
    description: "Connect with certified medical professionals instantly for consultations, second opinions, and care plans.",
    bg: "bg-emerald-50",
  },
  {
    icon: <Clock className="w-8 h-8 text-red-500" />,
    title: "Emergency Ready",
    description: "One-tap ambulance booking and instant emergency alerts ensure you get help exactly when you need it most.",
    bg: "bg-red-50",
  },
];

export const CoreValues: React.FC = () => {
  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">What Sets Us Apart</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CORE_VALUES_DATA.map((value, index) => (
          <div 
            key={index}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.20)] transition-all duration-300 hover:-translate-y-2 cursor-default group"
          >
            <div className={`w-16 h-16 rounded-2xl ${value.bg} flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              {value.icon}
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
              {value.title}
            </h4>
            <p className="text-slate-500 leading-relaxed font-medium">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};