import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Bot } from 'lucide-react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';
import { ROUTES } from '../../../constants/routes.constants'; 
import { DashboardHeader } from '../component/Dashboard.component/DashboardHeader';
import { HealthScoreCard } from '../component/Dashboard.component/HealthScoreCard';
import { HealthStats } from '../component/Dashboard.component/HealthStats';
import { UpcomingAppointment } from '../component/Dashboard.component/UpcomingAppointment';
import { AiHealthInsight } from '../component/Dashboard.component/AiHealthInsight';
import { SuggestedArticles } from '../component/Dashboard.component/SuggestedArticles';
import AboutUs from '../component/Dashboard.component/AboutUs'; 
import { Footer } from '../component/Dashboard.component/Footer'; 

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

  // --- Top-Right DotLottie Setup ---
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  useEffect(() => {
    if (!dotLottie) return;

    function onPlay() {
      console.log("Top-right animation start playing");
    }

    function onPause() {
      console.log("Top-right animation paused");
    }

    function onComplete() {
      console.log("Top-right animation completed");
    }

    dotLottie.addEventListener("play", onPlay);
    dotLottie.addEventListener("pause", onPause);
    dotLottie.addEventListener("complete", onComplete);

    return () => {
      dotLottie.removeEventListener("play", onPlay);
      dotLottie.removeEventListener("pause", onPause);
      dotLottie.removeEventListener("complete", onComplete);
    };
  }, [dotLottie]);

  const dotLottieRefCallback = useCallback((dotLottieInstance: DotLottie) => {
    setDotLottie(dotLottieInstance);
  }, []);
  // -----------------------------------

  return (
    <>
      {/* --- TOP RIGHT LOTTIE ANIMATION --- */}
      {/* <div className="fixed top-5 right-5 z-[100] w-12 h-12 sm:w-16 sm:h-16 pointer-events-auto">
        <DotLottieReact 
          src="path/to/animation.lottie" // TODO: Update with your actual Lottie path
          loop 
          autoplay 
          dotLottieRefCallback={dotLottieRefCallback} 
        />
      </div> */}

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

    </>
  );
}