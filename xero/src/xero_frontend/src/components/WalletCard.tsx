import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertCircle, ExternalLink } from 'lucide-react';

interface WalletCardProps {
  onConnect: () => void;
  balance?: string;
  isConnected: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({ onConnect, balance, isConnected }) => {
  const [isPlugInstalled, setIsPlugInstalled] = useState(false);

  useEffect(() => {
    // Check if Plug wallet is installed
    const checkPlug = async () => {
      // @ts-ignore
      const hasPlug = !!(window?.ic?.plug);
      setIsPlugInstalled(hasPlug);
    };
    checkPlug();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne text-[#2D2654]">Wallet Connection</h3>
        <Wallet className="text-[#666ED2]" />
      </div>

      {!isPlugInstalled ? (
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-500 mt-0.5" size={20} />
            <div>
              <p className="text-orange-700 font-medium mb-2">Plug Wallet Required</p>
              <p className="text-orange-600 text-sm mb-3">
                To use XERO, you need to install the Plug wallet extension.
              </p>
              <a 
                href="https://plugwallet.ooo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-orange-700 hover:text-orange-800"
              >
                Install Plug Wallet
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      ) : isConnected ? (
        <div>
          <p className="text-gray-500 mb-2">Connected Wallet</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-syne text-[#2D2654]">
              {balance} ICP
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="w-full py-3 bg-[#666ED2] text-white rounded-lg hover:bg-[#666ED2]/90 transition-colors flex items-center justify-center gap-2"
        >
          <Wallet size={20} />
          Connect Wallet
        </button>
      )}
    </motion.div>
  );
}; 