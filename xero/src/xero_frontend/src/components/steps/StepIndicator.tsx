import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  onClick: () => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  id,
  title,
  description,
  completed,
  current,
  onClick
}) => {
  return (
    <div 
      className={`flex items-start gap-3 ${(completed || current) ? 'cursor-pointer' : ''}`}
      onClick={() => (completed || current) && onClick()}
    >
      <div className="relative">
        <motion.div 
          className={`w-5 h-5 rounded-full border flex items-center justify-center
            ${completed ? 'bg-secondary border-secondary' : 'border-secondary'}`}
          initial={false}
          animate={completed ? { scale: [1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {completed && (
            <motion.span 
              className="text-white text-xs"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              ✓
            </motion.span>
          )}
        </motion.div>
        {!completed && (
          <motion.div
            className="absolute -inset-1 rounded-full border-2 border-secondary/30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-syne text-primary text-base mb-1 font-bold">
          {title}
        </span>
        <span className="font-raleway text-gray-500 text-sm max-w-[180px]">
          {description}
        </span>
      </div>
    </div>
  );
}; 