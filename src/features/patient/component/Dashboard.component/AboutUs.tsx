import { motion } from "framer-motion";
import { AboutHeader } from '../AboutUs.component/AboutHeader';
import { MissionHero } from '../AboutUs.component/MissionHero';
import { CoreValues } from '../AboutUs.component/CoreValues';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 }, 
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as "spring", stiffness: 300, damping: 24 } 
  },
};


export default function AboutUs() {
  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <AboutHeader />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MissionHero />
      </motion.div>

      <motion.div variants={itemVariants}>
        <CoreValues />
      </motion.div>

      {/* <motion.div variants={itemVariants}>
        <TrustBanner />
      </motion.div> */}
    </motion.div>
  );
}