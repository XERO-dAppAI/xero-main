import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../../context/StepContext';
import { IoMdInformationCircle } from 'react-icons/io';
import { 
  MdOutlineQueryStats, 
  MdLockOutline, 
  MdInventory2,
  MdOutlineAutoGraph,
  MdPriceChange
} from 'react-icons/md';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
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
      icon: <MdOutlineQueryStats className="w-6 h-6 text-[#666ed2]" />
    },
    {
      id: 'dynamic_pricing',
      title: 'Dynamic Pricing Adjustments',
      description: 'Adjust prices dynamically based on product lifecycle and demand.',
      icon: <MdPriceChange className="w-6 h-6 text-[#666ed2]" />
    },
    {
      id: 'inventory_insights',
      title: 'Real-Time Inventory Insights',
      description: 'Track and manage your inventory in real-time with advanced analytics.',
      icon: <MdInventory2 className="w-6 h-6 text-[#666ed2]" />
    },
    {
      id: 'blockchain_transparency',
      title: 'Blockchain-Based Transparency',
      description: 'Secure your data with tamper-proof, blockchain-verified records.',
      icon: <MdLockOutline className="w-6 h-6 text-[#666ed2]" />
    },
    {
      id: 'customer_patterns',
      title: 'Customer Buying Patterns',
      description: 'Analyze customer behavior to refine your marketing strategies.',
      icon: <MdOutlineAutoGraph className="w-6 h-6 text-[#666ed2]" />
    }
  ];

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
        <IoMdInformationCircle className="text-secondary w-5 h-5" />
        <span className="font-raleway text-sm">
          * Some features may not be included in the MVP version
        </span>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={() => {
              setSelectedFeatures(prev => 
                prev.includes(feature.id)
                  ? prev.filter(id => id !== feature.id)
                  : [...prev, feature.id]
              );
            }}
            className={`p-6 rounded-2xl bg-white border cursor-pointer
              ${selectedFeatures.includes(feature.id)
                ? 'border-[#666ed2] bg-[#666ed2]/5'
                : 'border-gray-100 hover:border-[#666ed2]/20'
              } transition-colors group`}
          >
            <motion.div 
              className="bg-[#666ed2]/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-[#666ed2]/20 transition-colors"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-syne mb-2 text-[#2D2654]">
              {feature.title}
            </h3>
            <p className="text-gray-500">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="relative mt-12"
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