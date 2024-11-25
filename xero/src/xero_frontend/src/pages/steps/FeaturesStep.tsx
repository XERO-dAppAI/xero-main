import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../../context/StepContext';
import { IoMdInformationCircle } from 'react-icons/io';
import { 
  MdOutlineQueryStats, 
  MdLockOutline, 
  MdInventory,
  MdOutlineAutoGraph,
  MdPriceChange
} from 'react-icons/md';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

export const FeaturesStep: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useStep();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const features: Feature[] = [
    {
      id: 'ai_forecasting',
      title: 'AI-Powered Demand Forecasting',
      description: 'Predict customer needs with data-driven insights for optimal restocking.',
      icon: <MdOutlineQueryStats className="w-8 h-8" />,
      available: true
    },
    {
      id: 'dynamic_pricing',
      title: 'Dynamic Pricing Adjustments',
      description: 'Adjust prices dynamically based on product lifecycle and demand.',
      icon: <MdPriceChange className="w-8 h-8" />,
      available: false
    },
    {
      id: 'inventory_insights',
      title: 'Real-Time Inventory Insights',
      description: 'Track and manage your inventory in real-time with advanced analytics.',
      icon: <MdInventory className="w-8 h-8" />,
      available: true
    },
    {
      id: 'blockchain_transparency',
      title: 'Blockchain-Based Transparency',
      description: 'Secure your data with tamper-proof, blockchain-verified records.',
      icon: <MdLockOutline className="w-8 h-8" />,
      available: true
    },
    {
      id: 'customer_patterns',
      title: 'Customer Buying Patterns',
      description: 'Analyze customer behavior to refine your marketing strategies.',
      icon: <MdOutlineAutoGraph className="w-8 h-8" />,
      available: false
    }
  ];

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async () => {
    if (selectedFeatures.length > 0) {
      completeStep(3);
      navigate('/terms');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center px-16 py-8">
      <motion.h1 
        className="section-title mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Features you use
      </motion.h1>

      <motion.div 
        className="text-center mb-12 flex items-center gap-2 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <IoMdInformationCircle className="text-secondary" />
        <span className="font-raleway text-sm">
          * Some features may not be included in the MVP version
        </span>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-12"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5 }}
            className={`relative rounded-xl p-6 cursor-pointer transition-all
              ${selectedFeatures.includes(feature.id) 
                ? 'bg-secondary text-white' 
                : 'bg-white text-primary hover:bg-gray-50'
              } border-2 border-gray-100`}
            onClick={() => toggleFeature(feature.id)}
          >
            {!feature.available && (
              <div className="absolute top-2 right-2 text-xs font-raleway text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                Coming Soon
              </div>
            )}
            <div className="flex flex-col h-full">
              <div className={`mb-4 ${selectedFeatures.includes(feature.id) ? 'text-white' : 'text-secondary'}`}>
                {feature.icon}
              </div>
              <h3 className="font-syne text-xl mb-2">{feature.title}</h3>
              <p className="font-raleway text-sm opacity-80">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 dark-purple-glow animate-glow rounded-lg" />
        <button
          onClick={handleSubmit}
          disabled={selectedFeatures.length === 0}
          className={`relative z-10 px-12 py-4 bg-[#666ed2] text-white rounded-lg font-raleway
            ${selectedFeatures.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#666ed2]/90'}
          `}
        >
          Continue to Terms
        </button>
      </motion.div>
    </div>
  );
}; 