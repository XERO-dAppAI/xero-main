import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

interface WalletCardProps {
  onConnect: () => void;
  balance: string;
  isConnected: boolean;
}

export const WalletCard = ({ onConnect, balance, isConnected }: WalletCardProps) => {
  return (
    <div className="bg-gradient-to-br from-[#1a6363] to-[#267c7c] rounded-2xl p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-syne">Wallet Balance</h2>
        <Wallet className="w-6 h-6" />
      </div>
      <div className="text-4xl font-syne mb-6">
        {isConnected ? `${balance} ICP` : '---.- ICP'}
      </div>
      {!isConnected && (
        <button 
          className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          onClick={onConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}; 