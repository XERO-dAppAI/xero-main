import React, { useState, useEffect, useMemo } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../../context/StepContext';
import { 
  Brain, 
  LineChart, 
  Package, 
  Lock, 
  Users,
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    id: 'ai_demand',
    title: 'AI-Powered Demand Forecasting',
    description: 'Predict customer needs with data-driven insights for optimal restocking.',
    icon: Brain,
    available: false
  },
  {
    id: 'dynamic_pricing',
    title: 'Dynamic Pricing Adjustments',
    description: 'Adjust prices dynamically based on product lifecycle and demand.',
    icon: LineChart,
    available: true
  },
  {
    id: 'inventory',
    title: 'Real-Time Inventory Insights',
    description: 'Track and manage your inventory in real-time with advanced analytics.',
    icon: Package,
    available: true
  },
  {
    id: 'blockchain',
    title: 'Blockchain-Based Transparency',
    description: 'Secure your data with tamper-proof, blockchain-verified records.',
    icon: Lock,
    available: true
  },
  {
    id: 'customer_patterns',
    title: 'Customer Buying Patterns',
    description: 'Analyze customer behavior to refine your marketing strategies.',
    icon: Users,
    available: true
  }
];

// Add this glass card style
const glassCardStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(6,36,36,0.05))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px 0 rgba(6,36,36,0.1)',
};

export const FeaturesStep: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useStep();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState(0);

  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [scope3, animate3] = useAnimate();
  const [scope4, animate4] = useAnimate();
  const [scope5, animate5] = useAnimate();

  const controls = useMemo(() => [
    { scope: scope1, animate: animate1 },
    { scope: scope2, animate: animate2 },
    { scope: scope3, animate: animate3 },
    { scope: scope4, animate: animate4 },
    { scope: scope5, animate: animate5 }
  ], [
    scope1, animate1,
    scope2, animate2,
    scope3, animate3,
    scope4, animate4,
    scope5, animate5
  ]);

  useEffect(() => {
    const animateIcons = async () => {
      for (let i = 0; i < controls.length; i++) {
        const { scope, animate } = controls[i];
        
        await animate(scope.current, 
          { 
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0],
          }, 
          { 
            duration: 1.5,
            delay: 0.2,
          }
        );
      }

      setTimeout(animateIcons, 1000);
    };

    animateIcons();
    return () => {};
  }, [controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async () => {
    try {
      localStorage.setItem('selected_features', JSON.stringify(selectedFeatures));
      await completeStep(3);
      navigate('/terms');
    } catch (error) {
      console.error('Error saving features:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <motion.h2 
        className="section-title mt-5 mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-[#062424]">Select your</span>{" "}
        <motion.span
          className="text-[#267c7c]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          features
        </motion.span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={() => handleFeatureToggle(feature.id)}
            className={`
              p-8 rounded-[32px] bg-white/40 backdrop-blur-[2px]
              border border-white/50 group transition-all duration-500
              hover:shadow-[0_8px_32px_0_rgba(95,152,152,0.2)]
              ${activeCard === index ? 'shadow-[0_8px_32px_0_rgba(95,152,152,0.25)]' : ''}
              relative overflow-hidden cursor-pointer
              aspect-square
            `}
          >
            {/* Glowing effect */}
            <div 
              className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-[#5f9898]/10 to-transparent
                transition-opacity duration-1000 pointer-events-none
                ${activeCard === index ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                transform: 'translateX(-100%)',
                animation: activeCard === index ? 'shine 2s ease-in-out' : 'none',
              }}
            />

            {/* Updated icon container with animation */}
            <motion.div 
              ref={controls[index].scope}
              className="relative p-3 rounded-xl w-fit mb-4 overflow-hidden"
              style={{
                background: 'rgba(95, 152, 152, 0.1)',
                border: '1px solid rgba(95, 152, 152, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(95, 152, 152, 0.1)',
              }}
            >
              <div className="relative z-10">
                <feature.icon className="w-6 h-6 text-[#5f9898] group-hover:text-white transition-colors duration-300" />
              </div>
            </motion.div>

            <h3 className="text-xl font-syne mb-4 text-[#062424]">
                {feature.title}
              </h3>
            <p className="text-gray-500 leading-relaxed line-clamp-3">
                {feature.description}
              </p>

            {/* Selection indicator */}
            {selectedFeatures.includes(feature.id) && (
              <div className="absolute inset-0 border-2 border-[#5f9898] rounded-[32px] pointer-events-none" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Submit Button - updated corners */}
      <div className="flex justify-center mt-12">
        <motion.button
          className="group relative overflow-hidden rounded-xl font-syne px-12 py-4 w-[380px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={selectedFeatures.length === 0}
        >
          {/* Glass effect background */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#062424]/90 to-[#1a6363]/90 backdrop-blur-[4px]" />
          
          {/* Shine effect */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 transform -translate-x-full animate-windshield bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </div>

          {/* Border glow */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          />

          {/* Button content */}
          <div className="relative z-10 flex items-center justify-center gap-2 text-white">
            <span>Continue to Terms</span>
            <motion.div
              animate={{ 
                x: [0, 5, 0] 
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}; 