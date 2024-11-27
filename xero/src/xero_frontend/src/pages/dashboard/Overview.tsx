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
      icon: <ShoppingBag className="text-[#666ED2]" />,
      title: "XERO Marketplace",
      description: "Trade and exchange inventory with other businesses"
    },
    {
      icon: <Coins className="text-[#666ED2]" />,
      title: "XEROW Coin",
      description: "Earn and trade with our native token"
    },
    {
      icon: <Trophy className="text-[#666ED2]" />,
      title: "XERO League",
      description: "Compete and earn rewards for sustainable practices"
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-8 mb-8"
      >
        <h1 className="text-3xl font-syne text-[#2D2654] mb-4">Welcome to XERO Dashboard</h1>
        <p className="text-gray-600">
          Manage your inventory, reduce waste, and optimize your business operations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Wallet Card */}
        <WalletCard 
          onConnect={connectWallet}
          balance={balance}
          isConnected={isWalletConnected}
        />

        {/* Pro Features Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-syne text-[#2D2654]">Upgrade to Pro</h3>
            <Star className="text-[#666ED2]" />
          </div>

          {showProFeatures ? (
            <div className="space-y-4">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.icon}
                  <div>
                    <h4 className="font-medium text-[#2D2654]">{feature.title}</h4>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-[#666ED2]/5 rounded-lg">
                <p className="text-[#666ED2] font-medium mb-2">Beta Launch Coming Soon!</p>
                <a 
                  href="#waitlist"
                  className="inline-flex items-center gap-2 text-sm text-[#666ED2] hover:text-[#4F55A9]"
                >
                  Join the Waitlist
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowProFeatures(true)}
              className="w-full py-3 bg-[#666ED2]/10 text-[#666ED2] rounded-lg hover:bg-[#666ED2]/20 transition-colors flex items-center justify-center gap-2"
            >
              <Star size={20} />
              View Pro Features
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}; 