import React from 'react';
import { motion } from 'framer-motion';
import { Building2, User } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelect: (type: 'individual' | 'business') => void;
}

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto p-6"
    >
      <h2 className="text-2xl font-semibold text-white mb-2">
        Welcome to XERO
      </h2>
      <p className="text-white/60 mb-8">
        Choose your account type to get started
      </p>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('individual')}
          className="w-full p-6 rounded-xl bg-[#1a1a1a] border border-[#1a6363]/20 hover:border-[#1a6363]/40 
            transition-colors group relative overflow-hidden"
        >
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a6363]/10 via-transparent to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-lg bg-[#1a6363]/20">
              <User className="w-6 h-6 text-[#1a6363]" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium mb-1">Individual</h3>
              <p className="text-white/60 text-sm">
                Join as a conscious consumer and help reduce food waste
              </p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('business')}
          className="w-full p-6 rounded-xl bg-[#1a1a1a] border border-[#1a6363]/20 hover:border-[#1a6363]/40 
            transition-colors group relative overflow-hidden"
        >
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a6363]/10 via-transparent to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-lg bg-[#1a6363]/20">
              <Building2 className="w-6 h-6 text-[#1a6363]" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium mb-1">Business</h3>
              <p className="text-white/60 text-sm">
                Register your business and optimize your inventory management
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      <p className="text-white/40 text-sm text-center mt-6">
        You can change your account type later in settings
      </p>
    </motion.div>
  );
}; 