import React from 'react';
import { motion } from 'framer-motion';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {[...Array(totalSteps)].map((_, index) => (
        <motion.div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentStep - 1 
              ? 'w-8 bg-secondary' 
              : 'w-2 bg-gray-300'
          }`}
          initial={{ scale: 0.8 }}
          animate={{ scale: index === currentStep - 1 ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}; 