import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface LoadingTransitionProps {
  onComplete: () => void;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Loading Icon */}
      <div className="mb-8 relative">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-[#062424]/20 border-t-[#1a6363]"
          animate={{ 
            rotate: 360
          }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity
          }}
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-syne text-[#062424] mb-2">
          Loading your dashboard...
        </h2>
      </div>

      {/* Progress Bar Container */}
      <div className="w-[300px] h-2 bg-[#062424]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#062424] to-[#1a6363] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(26,99,99,0.03) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}; 