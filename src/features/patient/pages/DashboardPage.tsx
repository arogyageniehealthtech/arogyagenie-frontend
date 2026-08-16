import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Bot } from 'lucide-react';
import { ROUTES } from '../../../constants/routes.constants'; 
import { DashboardHeader } from '../components/Dashboard.component/DashboardHeader';
import { HealthScoreCard } from '../components/Dashboard.component/HealthScoreCard';
import { HealthStats } from '../components/Dashboard.component/HealthStats';
import { UpcomingAppointment } from '../components/Dashboard.component/UpcomingAppointment';
import { AiHealthInsight } from '../components/Dashboard.component/AiHealthInsight';
import { SuggestedArticles } from '../components/Dashboard.component/SuggestedArticles';
import AboutUs from '../components/Dashboard.component/AboutUs'; 
import { Footer } from '../components/Dashboard.component/Footer'; 

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, 
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 }, 
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as "spring",
      stiffness: 300, 
      damping: 24 
    } 
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
    
      <motion.div 
        className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 font-sans relative"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
     
        <motion.div variants={itemVariants} className="lg:hidden pt-6">
          <DashboardHeader />
        </motion.div>
        
      
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          
        
          <div className="flex flex-col gap-6 lg:col-span-7">
            <motion.div variants={itemVariants}>
              <HealthScoreCard />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <HealthStats />
            </motion.div>
          </div>
          
         
          <div className="flex flex-col gap-6 lg:col-span-5">
            <motion.div variants={itemVariants}>
              <UpcomingAppointment />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <AiHealthInsight />
            </motion.div>
          </div>

        </div>

        
        <motion.div variants={itemVariants} className="mt-6 lg:mt-8">
          <SuggestedArticles />
        </motion.div>

      </motion.div>

   
      <div className="bg-white/50 border-t border-slate-100">
        <AboutUs />
      </div>

     
      <Footer />


      <button
        onClick={() => navigate(ROUTES.PATIENT.AI_CHAT)}
        className="fixed bottom-24 right-5 lg:bottom-10 lg:right-10 z-100 flex items-center justify-center gap-2 rounded-full bg-(--color-arogya-dark) px-4 py-4 sm:px-6 shadow-[0_8px_30px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-[0_12px_40px_rgba(79,70,229,0.5)] group"
        aria-label="Open AI Health Assistant"
      >
        <Bot className="h-6 w-6 text-white group-hover:animate-bounce" />
        <span className="hidden sm:inline font-bold text-white tracking-wide">Help</span>
      </button>

    </>
  );
}