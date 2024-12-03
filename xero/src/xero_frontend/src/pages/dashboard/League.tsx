import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart, Share2, Star, X } from 'lucide-react';
import game1 from '../../assets/game1.png';
import game2 from '../../assets/game2.png';
import game3 from '../../assets/game3.png';
import game4 from '../../assets/game4.png';

interface Game {
  id: string;
  title: string;
  description: string;
  reward: string;
  rating: number;
  episodes: number;
  image: string;
  type: 'Game' | 'Challenge' | 'Quest';
}

export const League: React.FC = () => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [showGames, setShowGames] = useState(false);
  const [likedGames, setLikedGames] = useState<Set<string>>(new Set());
  const [gameLikes, setGameLikes] = useState<{ [key: string]: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const games: Game[] = [
    {
      id: '1',
      title: 'Inventory Master Saga',
      description: 'Master the art of inventory management in this epic challenge',
      reward: '50 XEROW',
      rating: 8.83,
      episodes: 24,
      image: game1,
      type: 'Game'
    },
    {
      id: '2',
      title: 'Supply Chain Chronicles',
      description: 'Build and optimize your supply chain empire',
      reward: '100 XEROW',
      rating: 8.62,
      episodes: 12,
      image: game2,
      type: 'Challenge'
    },
    {
      id: '3',
      title: 'Market Analysis Quest',
      description: 'Analyze market trends and predict future patterns',
      reward: '75 XEROW',
      rating: 9.05,
      episodes: 10,
      image: game3,
      type: 'Quest'
    },
    {
      id: '4',
      title: 'Price Optimization Saga',
      description: 'Master dynamic pricing strategies in real-time',
      reward: '120 XEROW',
      rating: 8.94,
      episodes: 18,
      image: game4,
      type: 'Game'
    },
    {
      id: '5',
      title: 'Sustainability Challenge',
      description: 'Create eco-friendly business solutions',
      reward: '90 XEROW',
      rating: 8.71,
      episodes: 15,
      image: '/games/eco.jpg',
      type: 'Challenge'
    },
    {
      id: '6',
      title: 'Resource Management',
      description: 'Optimize resource allocation and efficiency',
      reward: '85 XEROW',
      rating: 8.88,
      episodes: 20,
      image: '/games/resource.jpg',
      type: 'Game'
    },
    {
      id: '7',
      title: 'Business Strategy Quest',
      description: 'Develop winning business strategies',
      reward: '150 XEROW',
      rating: 9.12,
      episodes: 16,
      image: '/games/strategy.jpg',
      type: 'Quest'
    },
    {
      id: '8',
      title: 'Financial Planning Saga',
      description: 'Master financial forecasting and planning',
      reward: '110 XEROW',
      rating: 8.79,
      episodes: 22,
      image: '/games/finance.jpg',
      type: 'Game'
    },
    {
      id: '9',
      title: 'Customer Experience',
      description: 'Enhance customer satisfaction and loyalty',
      reward: '95 XEROW',
      rating: 8.91,
      episodes: 14,
      image: '/games/customer.jpg',
      type: 'Challenge'
    },
    {
      id: '10',
      title: 'Innovation Quest',
      description: 'Create innovative solutions for business challenges',
      reward: '130 XEROW',
      rating: 9.15,
      episodes: 25,
      image: '/games/innovation.jpg',
      type: 'Quest'
    },
    {
      id: '11',
      title: 'Data Analytics Master',
      description: 'Harness the power of business analytics',
      reward: '140 XEROW',
      rating: 8.95,
      episodes: 20,
      image: '/games/analytics.jpg',
      type: 'Game'
    },
    {
      id: '12',
      title: 'Team Leadership',
      description: 'Lead your team to business success',
      reward: '115 XEROW',
      rating: 8.87,
      episodes: 18,
      image: '/games/leadership.jpg',
      type: 'Challenge'
    },
    {
      id: '13',
      title: 'Digital Marketing Quest',
      description: 'Master modern marketing strategies',
      reward: '105 XEROW',
      rating: 8.82,
      episodes: 16,
      image: '/games/marketing.jpg',
      type: 'Quest'
    },
    {
      id: '14',
      title: 'Risk Management Saga',
      description: 'Navigate business risks and opportunities',
      reward: '125 XEROW',
      rating: 8.93,
      episodes: 21,
      image: '/games/risk.jpg',
      type: 'Game'
    },
    {
      id: '15',
      title: 'Global Trade Master',
      description: 'Expand your business globally',
      reward: '160 XEROW',
      rating: 9.08,
      episodes: 24,
      image: '/games/global.jpg',
      type: 'Challenge'
    },
    {
      id: '16',
      title: 'Tech Innovation Quest',
      description: 'Implement cutting-edge business technologies',
      reward: '145 XEROW',
      rating: 9.21,
      episodes: 19,
      image: '/games/tech.jpg',
      type: 'Quest'
    },
    {
      id: '17',
      title: 'Quality Control Saga',
      description: 'Maintain highest quality standards',
      reward: '95 XEROW',
      rating: 8.75,
      episodes: 15,
      image: '/games/quality.jpg',
      type: 'Game'
    },
    {
      id: '18',
      title: 'Growth Strategy',
      description: 'Scale your business effectively',
      reward: '135 XEROW',
      rating: 8.98,
      episodes: 23,
      image: '/games/growth.jpg',
      type: 'Challenge'
    },
    {
      id: '19',
      title: 'Operations Quest',
      description: 'Optimize business operations',
      reward: '120 XEROW',
      rating: 8.89,
      episodes: 17,
      image: '/games/operations.jpg',
      type: 'Quest'
    },
    {
      id: '20',
      title: 'Business Ethics Saga',
      description: 'Build an ethical and sustainable business',
      reward: '140 XEROW',
      rating: 9.10,
      episodes: 20,
      image: '/games/ethics.jpg',
      type: 'Game'
    }
  ];

  // Create an infinitely repeating array
  const infiniteGames = [...games, ...games, ...games]; // Triple the array for smooth infinite scroll

  useEffect(() => {
    if (showGames && !isInteracting) {
      const interval = setInterval(() => {
        setCurrentGameIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= games.length * 2) {
            return games.length;
          }
          return nextIndex;
        });
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [showGames, games.length, isInteracting]);

  const handleLike = (gameId: string) => {
    setLikedGames(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(gameId)) {
        newLiked.delete(gameId);
      } else {
        newLiked.add(gameId);
      }
      return newLiked;
    });

    setGameLikes(prev => ({
      ...prev,
      [gameId]: (prev[gameId] || 0) + (likedGames.has(gameId) ? -1 : 1)
    }));
  };

  const handleShare = (game: Game) => {
    const shareText = `Join me in the ${game.title} on XERO League! Play now and earn ${game.reward}! 🎮`;
    const shareUrl = `https://xero.com/league/${game.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowGames(false);
    setShowExitConfirm(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-[#1a6363]/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setShowGames(true)}
        >
          <div className="p-3 bg-[#1a6363]/10 rounded-xl w-fit mb-4">
            <Trophy className="text-[#1a6363]" size={24} />
          </div>
          <h3 className="text-lg font-syne text-[#062424] mb-2">Compete & Earn</h3>
          <p className="text-[#062424]/60">Participate in challenges and earn rewards</p>
        </motion.div>
      </div>

      {showGames && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-50">
          <motion.button
            className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-sm rounded-full z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExitClick}
          >
            <X className="text-white" size={24} />
          </motion.button>

          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1a1a1a] p-8 rounded-2xl max-w-md w-full mx-4"
              >
                <h3 className="text-xl font-syne text-white mb-4">
                  Exit Game Mode?
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to exit? Your progress will be saved.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#1a6363] text-white hover:bg-[#1a6363]/90 transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          <div ref={containerRef} className="h-screen w-full overflow-hidden">
            <motion.div
              className="h-full"
              animate={{ 
                y: `-${(currentGameIndex * 100)}%`
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
                type: "tween"
              }}
            >
              {infiniteGames.map((game, index) => (
                <motion.div 
                  key={`${game.id}-${index}`}
                  className="h-full w-full flex items-center justify-center relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: currentGameIndex === index ? 1 : 0.5,
                    scale: currentGameIndex === index ? 1 : 0.9,
                    y: currentGameIndex === index ? 0 : 20
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  onPointerDown={() => setIsInteracting(true)}
                  onPointerUp={() => setIsInteracting(false)}
                  onPointerLeave={() => setIsInteracting(false)}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.y < -50) {
                      setCurrentGameIndex(prev => (prev + 1) % infiniteGames.length);
                    } else if (info.offset.y > 50) {
                      setCurrentGameIndex(prev => 
                        prev - 1 < 0 ? infiniteGames.length - 1 : prev - 1
                      );
                    }
                  }}
                >
                  <motion.div 
                    className="w-[350px] h-[600px] bg-[#1a1a1a] rounded-xl relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1,
                      rotateX: isInteracting ? 5 : 0,
                      rotateY: isInteracting ? 5 : 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: 1000
                    }}
                  >
                    {/* Game Image */}
                    <div className="w-full h-[70%] relative">
                      <img 
                        src={game.image} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10" />
                      <div className="absolute top-4 left-4 px-2 py-1 bg-[#1a6363] text-white text-sm rounded">
                        {game.type}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm">{game.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-xl font-syne text-white mb-2">
                        {game.title}
                        </h3>
                      <p className="text-gray-400 text-sm mb-4">
                          {game.description}
                        </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="text-[#1a6363]" size={20} />
                          <span className="text-[#1a6363] font-medium">
                          {game.reward}
                        </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-white text-sm">
                            Episodes: {game.episodes}
                          </div>
                        </div>
                    </div>

                    {/* Interactive Buttons */}
                      <div className="absolute right-6 -top-16 flex flex-col gap-4">
                      <motion.button 
                          className="p-3 bg-black/50 backdrop-blur-sm rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLike(game.id)}
                      >
                        <Heart 
                          className={`${
                            likedGames.has(game.id) 
                              ? 'text-red-500 fill-red-500' 
                                : 'text-white hover:text-red-500'
                            }`}
                            size={24}
                          />
                      </motion.button>
                      <motion.button 
                          className="p-3 bg-black/50 backdrop-blur-sm rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare(game)}
                      >
                          <Share2 className="text-white" size={24} />
                      </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Progress Dots */}
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    {games.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentGameIndex % games.length
                            ? 'bg-white h-6'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}; 