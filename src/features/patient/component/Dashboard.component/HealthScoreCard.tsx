import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function HealthScoreCard() {
  return (
    <div className="group relative w-full overflow-hidden rounded-3xl bg-[#120F2F] p-6 md:p-8 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      
     
      <div className="pointer-events-none absolute left-10 top-0 h-32 w-32 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20 group-hover:scale-125"></div>
      <div className="pointer-events-none absolute right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl transition-all duration-500 group-hover:bg-red-500/20 group-hover:scale-125"></div>

    
      <h2 className="mb-4 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-cyan-400">
        Health Score
      </h2>
      
      <div className="flex items-center justify-between">
        
       
        <div className="relative flex h-24 w-24 items-center justify-center lg:h-28 lg:w-28">
          <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A7DFF" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="none" stroke="#25214E" strokeWidth="8" />
            
          
            <motion.circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="url(#scoreGradient)" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeDasharray="264" 
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 40 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
            />
          </svg>
          <div className="z-10 flex flex-col items-center justify-center text-center">
           
            <span className="text-3xl font-bold leading-none text-white lg:text-4xl transition-transform duration-300 group-hover:scale-110">
              85
            </span>
            <span className="text-[10px] font-medium text-slate-400">/100</span>
            <span className="mt-0.5 text-xs font-semibold text-[#00E5FF]">Good</span>
          </div>
        </div>

      
        <div className="relative flex h-full flex-col items-center justify-end pr-2">
          
       
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.8,
              ease: "easeInOut" 
            }}
            className="relative top-3 z-10"
          >
            <Heart className="h-10 w-10 fill-[#FF3B30] text-[#FF3B30] drop-shadow-[0_0_15px_rgba(255,59,48,0.5)]" />
          </motion.div>

         
          <div className="w-30 overflow-hidden">
            <svg width="240" height="40" viewBox="0 0 240 40" className="opacity-90">
              <motion.path 
               
                d="M0 20 H30 L38 10 L48 35 L58 5 L68 25 L75 20 H120 H150 L158 10 L168 35 L178 5 L188 25 L195 20 H240" 
                fill="none" 
                stroke="#00E5FF" 
                strokeWidth="2.5" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
                
               
                initial={{ x: 0 }}
                animate={{ x: -120 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5, 
                  ease: "linear" 
                }}
              />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}