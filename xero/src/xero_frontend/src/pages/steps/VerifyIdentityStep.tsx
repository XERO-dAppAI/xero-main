import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import dfinity from '../../assets/dfinity.png';
import nfid from '../../assets/nfid.png';
import { useAuth } from '../../hooks/useAuth';
import { Principal } from '@dfinity/principal';
import { useStep } from '../../context/StepContext';

export const VerifyIdentityStep: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithII, loginWithNFID, walletAddress } = useAuth();
  const { completeStep } = useStep();

  const handleIILogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting II authentication...');
      await loginWithII();
      console.log('II Authentication successful');
      completeStep(1);
      navigate('/business-profile');
    } catch (error) {
      console.error('II authentication error:', error);
      setError('Failed to authenticate with Internet Identity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNFIDLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loginWithNFID();
      console.log('Authenticated with NFID, wallet:', walletAddress);
      completeStep(1);
      navigate('/business-profile');
    } catch (error) {
      setError('Failed to authenticate with NFID. Please try again.');
      console.error('NFID authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="flex flex-col items-center gap-6 mb-12">
        <motion.h2 
          className="section-title mt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <span className="text-[#062424]">Verify your</span>{" "}
          <motion.span
            className="text-[#267c7c]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            identity
          </motion.span>
        </motion.h2>

        <motion.div 
          className="relative w-full max-w-[95%] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl" />
          
          <div className="relative z-10 p-8">
            {error && (
              <motion.div 
                className="bg-red-50/50 backdrop-blur-sm text-red-500 p-4 rounded-xl mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="flex flex-col items-center gap-6">
              <motion.button
                className="group relative overflow-hidden rounded-xl bg-[#062424] w-[380px]"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0 // First button starts immediately
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleIILogin}
              >
                <div className="absolute inset-0 rounded-xl">
                  <div 
                    className="absolute inset-0 animate-border-glow"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transform: 'translateX(-100%)',
                    }}
                  />
                </div>

                <div className="absolute inset-0 w-full h-full">
                  <div 
                    className="absolute inset-0 transform -translate-x-full animate-windshield bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                </div>

                <div className="relative flex items-center">
                  <div className="w-[60px] flex items-center justify-center p-4 border-r border-[#1a6363]">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <img 
                        src={dfinity} 
                        alt="Internet Identity" 
                        className="w-6 h-6 object-contain"
                      />
                    </motion.div>
                  </div>
                  <div className="flex-1 text-center text-white font-syne text-base tracking-wide py-3 px-4">
                    {isLoading ? 'Authenticating...' : 'Sign Up with Internet Identity'}
                  </div>
                </div>
              </motion.button>

              <div className="flex items-center gap-4 w-[380px]"> {/* Match button width */}
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#062424]/20 to-transparent"></div>
                <motion.span 
                  className="font-syne font-medium text-[#062424] px-4"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  OR
                </motion.span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#062424]/20 to-transparent"></div>
              </div>

              <motion.button
                className="group relative overflow-hidden rounded-xl bg-[#1a6363] w-[380px]"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5 // Second button starts halfway through first button's animation
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNFIDLogin}
              >
                <div className="absolute inset-0 rounded-xl">
                  <div 
                    className="absolute inset-0 animate-border-glow"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transform: 'translateX(-100%)',
                    }}
                  />
                </div>

                <div className="absolute inset-0 w-full h-full">
                  <div 
                    className="absolute inset-0 transform -translate-x-full animate-windshield bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                </div>

                <div className="relative flex items-center">
                  <div className="w-[60px] flex items-center justify-center p-4 border-r border-[#062424]">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.img 
                        src={nfid} 
                        alt="NFID" 
                        className="w-6 h-6 object-contain"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex-1 text-center text-white font-syne text-base tracking-wide py-3 px-4">
                    {isLoading ? 'Authenticating...' : 'Sign Up with NFID'}
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 