
// import React from 'react';
// import { Activity } from 'lucide-react';

// export const MissionHero: React.FC = () => {
//   return (
//     <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] mb-16 group">
//       <img 
//         src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80" 
//         alt="Medical professional looking at data" 
//         className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
//       />
//       <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
      
//       <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center max-w-2xl">
//         <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 px-4 py-2 rounded-full backdrop-blur-md w-fit mb-6 border border-indigo-400/30">
//           <Activity size={18} />
//           <span className="text-sm font-bold tracking-wide uppercase">Our Mission</span>
//         </div>
//         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
//           Making premium healthcare accessible, intelligent, and instant.
//         </h2>
//         <p className="text-slate-300 text-lg">
//           We believe that managing your health shouldn't be complicated. By combining real-time tracking, AI diagnostics, and a network of premier hospitals, we provide a 360-degree safety net for you and your family.
//         </p>
//       </div>
//     </div>
//   );
// };

// src/features/dashboard/components/AboutUs.component/MissionHero.tsx
import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

export const MissionHero: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] mb-16 group bg-white flex flex-col md:flex-row border border-slate-200 transition-all duration-500 hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.20)]">

      
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-linear-to-br from-white via-slate-50 to-indigo-50/50">
        
       
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full w-fit mb-6 border border-indigo-100 shadow-sm">
            <Activity size={18} />
            <span className="text-sm font-bold tracking-wide uppercase">Our Mission</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.15]">
            Making healthcare <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-cyan-500">intelligent</span> & instant.
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed font-medium mb-8">
            We believe managing your health shouldn't be complicated. By combining real-time tracking, AI diagnostics, and premier hospitals, we provide a 360-degree safety net for you and your family.
          </p>

          <div className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase tracking-wider">
             <Sparkles size={16} className="text-orange-400" />
             Empowering Patients
          </div>
        </div>
      </div>

      
      <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8 bg-slate-50 flex items-center justify-center">
        <div className="relative w-full h-75 md:h-full min-h-87.5 rounded-2xl overflow-hidden shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80" 
            alt="Modern AI Healthcare"
            className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
          />
         
          <div className="absolute inset-0 bg-indigo-900/10 transition-opacity duration-500 group-hover:opacity-0"></div>
        </div>
      </div>

    </div>
  );
};