import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    <div className="flex-grow flex flex-col items-center justify-center px-16">
      <div className="text-center mb-16">
        <motion.h1 
          className="section-title mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Verify Identity
        </motion.h1>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <motion.div 
        className="w-full max-w-[480px] flex flex-col gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div 
          className="flex cursor-pointer group relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleIILogin}
        >
          <div className="flex w-full relative z-10">
            <div className="w-[72px] bg-primary flex items-center justify-center p-4">
              <img 
                src={dfinity} 
                alt="Internet Identity" 
                className="w-full h-auto object-contain"
              />
            </div>
            <button 
              className="flex-1 bg-secondary text-white py-4 px-6 font-raleway text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign Up with Internet Identity'}
            </button>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-gray-200"></div>
          <motion.span 
            className="font-syne text-xl text-primary"
            animate={{ 
              scale: [1, 1.1, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            OR
          </motion.span>
          <div className="h-[1px] flex-1 bg-gray-200"></div>
        </div>

        <motion.div 
          className="flex cursor-pointer group relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNFIDLogin}
        >
          <div className="absolute inset-0 dark-purple-glow animate-glow" />
          
          <div className="flex w-full relative z-10">
            <div className="w-[72px] bg-primary flex items-center justify-center p-4 group-hover:bg-primary/90 transition-colors">
              <motion.img 
                src={nfid} 
                alt="NFID" 
                className="w-full h-auto object-contain"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <button 
              className="flex-1 bg-secondary text-white py-4 px-6 font-raleway text-lg group-hover:bg-secondary/90 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign Up with NFID'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 