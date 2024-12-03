import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Star, 
  ExternalLink, 
  ShoppingBag, 
  Trophy, 
  Coins
} from 'lucide-react';
import { WalletCard } from '../../components/WalletCard';

export const Overview: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [balance, setBalance] = useState<string>('0.00');
  const [showProFeatures, setShowProFeatures] = useState(false);

  const connectWallet = async () => {
    try {
      // @ts-ignore
      const publicKey = await window.ic.plug.requestConnect();
      if (publicKey) {
        setIsWalletConnected(true);
        // Get balance
        // @ts-ignore
        const balance = await window.ic.plug.requestBalance();
        if (balance && balance.length > 0) {
          setBalance(balance[0].amount);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const proFeatures = [
    {
      icon: <ShoppingBag className="text-[#1a6363]" />,
      title: "XERO Marketplace",
      description: "Trade and exchange inventory with other businesses"
    },
    {
      icon: <Coins className="text-[#1a6363]" />,
      title: "XEROW Coin",
      description: "Earn and trade with our native token"
    },
    {
      icon: <Trophy className="text-[#1a6363]" />,
      title: "XERO League",
      description: "Compete and earn rewards for sustainable practices"
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto p-8">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-[#1a6363] to-[#267c7c] rounded-2xl p-6 text-white mb-8">
        <h2 className="text-2xl font-syne mb-4">Wallet Balance</h2>
        <div className="text-4xl font-syne mb-6">---.- ICP</div>
        <button 
          className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </div>

      {/* Pro Features Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1a6363]/10">
        <h2 className="text-2xl font-syne text-[#1a6363] mb-4">Upgrade to Pro</h2>
        <p className="text-[#062424]/60">Get access to exclusive features</p>
      </div>
    </div>
  );
}; 