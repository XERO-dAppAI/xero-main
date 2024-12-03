import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart, Share2, Star, X } from 'lucide-react';
import game1 from '../../assets/game1.png';
import game2 from '../../assets/game2.png';
import game3 from '../../assets/game3.png';
import game4 from '../../assets/game4.png';
import game7 from '../../assets/game7.png';
import game8 from '../../assets/game8.png';
import { Star as StarIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Game {
  id: string;
  title: string;
  description: string;
  reward: string;
  rating: number;
  episodes: number;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Update FloatingHeart component to create multiple hearts
const FloatingHeart = ({ onComplete }: { onComplete: () => void }) => {
  // Create 5 hearts with different paths
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, y: 0, x: 0, opacity: 1 }}
          animate={{
            scale: [1, 0.8 + Math.random() * 0.5, 1.2, 1],
            y: [-20, -60 - Math.random() * 40], // Random height
            x: Math.random() * 100 - 50, // Random spread
            opacity: [1, 1, 0],
            rotate: Math.random() * 360 // Random rotation
          }}
          transition={{ 
            duration: 0.8 + Math.random() * 0.5, // Random duration
            ease: "easeOut"
          }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
          className="absolute pointer-events-none"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Heart 
            className="text-red-500 fill-red-500" 
            size={16 + Math.random() * 8} // Random sizes
          />
        </motion.div>
      ))}
    </>
  );
};

export const League: React.FC = () => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [showGames, setShowGames] = useState(false);
  const [likedGames, setLikedGames] = useState<Set<string>>(new Set());
  const [gameLikes, setGameLikes] = useState<{ [key: string]: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<string[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [userRatings, setUserRatings] = useState<{ [key: string]: number }>({});
  const [showRating, setShowRating] = useState<string | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);

  const games: Game[] = [
    {
      id: '1',
      title: 'Social Media Awakening',
      description: 'Join the XERO Alliance! Your first quest: Connect with fellow traders on X and Telegram. Forge bonds that will shape your destiny in the world of decentralized commerce! 🌟⚔️',
      reward: '100 XEROW',
      rating: 8.83,
      episodes: 24,
      image: game1,
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Supply Chain Chronicles',
      description: 'Build and optimize your supply chain empire',
      reward: '100 XEROW',
      rating: 8.62,
      episodes: 12,
      image: game2,
      difficulty: 'Medium'
    },
    {
      id: '3',
      title: 'Market Analysis Quest',
      description: 'Analyze market trends and predict future patterns',
      reward: '75 XEROW',
      rating: 9.05,
      episodes: 10,
      image: game3,
      difficulty: 'Hard'
    },
    {
      id: '4',
      title: 'Price Optimization Saga',
      description: 'Master dynamic pricing strategies in real-time',
      reward: '120 XEROW',
      rating: 8.94,
      episodes: 18,
      image: game4,
      difficulty: 'Medium'
    },
    {
      id: '5',
      title: 'Sustainability Challenge',
      description: 'Create eco-friendly business solutions',
      reward: '90 XEROW',
      rating: 8.71,
      episodes: 15,
      image: game3,
      difficulty: 'Easy'
    },
    {
      id: '6',
      title: 'Resource Management',
      description: 'Optimize resource allocation and efficiency',
      reward: '85 XEROW',
      rating: 8.88,
      episodes: 20,
      image: game4,
      difficulty: 'Medium'
    },
    {
      id: '7',
      title: 'Business Strategy Quest',
      description: 'Develop winning business strategies',
      reward: '150 XEROW',
      rating: 9.12,
      episodes: 16,
      image: game7,
      difficulty: 'Hard'
    },
    {
      id: '8',
      title: 'Financial Planning Saga',
      description: 'Master financial forecasting and planning',
      reward: '110 XEROW',
      rating: 8.79,
      episodes: 22,
      image: game8,
      difficulty: 'Medium'
    },
    {
      id: '9',
      title: 'Customer Experience',
      description: 'Enhance customer satisfaction and loyalty',
      reward: '95 XEROW',
      rating: 8.91,
      episodes: 14,
      image: game7,
      difficulty: 'Easy'
    },
    {
      id: '10',
      title: 'Innovation Quest',
      description: 'Create innovative solutions for business challenges',
      reward: '130 XEROW',
      rating: 9.15,
      episodes: 25,
      image: game8,
      difficulty: 'Hard'
    }
  ];

  // Create an infinitely repeating array
  const infiniteGames = [...games, ...games, ...games]; // Triple the array for smooth infinite scroll

  useEffect(() => {
    if (showGames && !isInteracting && !showChallenge) {  // Stop scrolling during verification
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
  }, [showGames, games.length, isInteracting, showChallenge]);

  const handleLike = (gameId: string) => {
    setLikedGames(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(gameId)) {
        newLiked.delete(gameId);
      } else {
        newLiked.add(gameId);
        // Add floating hearts only when liking
        setFloatingHearts(prev => [...prev, `${gameId}-${Date.now()}`]);
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

  const handleRate = (gameId: string, rating: number) => {
    setUserRatings(prev => ({
      ...prev,
      [gameId]: rating
    }));

    // Calculate new average rating (using 5-star scale)
    const currentRating = ratings[gameId] || game.rating;
    const currentCount = userRatings[gameId] ? 1 : 0;
    const newRating = ((currentRating * currentCount) + rating) / (currentCount + 1);

    setRatings(prev => ({
      ...prev,
      [gameId]: Number(newRating.toFixed(2))
    }));
  };

  const handlePlayNow = (game: Game) => {
    setSelectedGame(game);
    setShowChallenge(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofImage(file);
    }
  };

  const handleVerification = async () => {
    setIsAnalyzing(true);
    
    // Quick verification animation (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerified(true);
    
    // Show completion message
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAnalyzing(false);
    setIsVerificationComplete(true);
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent" />
                      <div className="absolute top-4 left-4 px-2 py-1 text-white text-sm z-30">
                        <div className={`
                          px-5 py-1.5 
                          backdrop-blur-md 
                          border-l-2
                          shadow-inner
                          font-medium 
                          tracking-wider
                          ${game.difficulty === 'Easy' 
                            ? 'bg-emerald-900/20 border-emerald-400/40 text-emerald-300/90' 
                            : game.difficulty === 'Medium'
                            ? 'bg-amber-900/20 border-amber-400/40 text-amber-300/90'
                            : 'bg-red-900/20 border-red-400/40 text-red-300/90'
                          }
                          clip-path-polygon
                        `}
                          style={{
                            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {game.difficulty}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 z-30 group">
                        <div 
                          className="relative"
                          onMouseEnter={() => setShowRating(game.id)}
                          onMouseLeave={() => setShowRating(null)}
                        >
                          <div className="flex items-center gap-1">
                            <StarIcon 
                              className="w-4 h-4 text-yellow-400 fill-yellow-400 cursor-pointer" 
                              onClick={() => setShowRating(game.id)}
                            />
                            <span className="text-white text-sm">
                              {(ratings[game.id] || game.rating).toFixed(2)}
                            </span>
                          </div>

                          {/* Rating popup */}
                          {showRating === game.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-xl p-3 w-48"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="text-white text-sm mb-2">Rate this game:</div>
                                <div className="flex justify-center gap-1">
                                  {[...Array(5)].map((_, i) => {
                                    const ratingValue = (i + 1);
                                    return (
                                      <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleRate(game.id, ratingValue)}
                                        className={`p-1 transition-colors ${
                                          (userRatings[game.id] || 0) >= ratingValue 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-500'
                                        }`}
                                      >
                                        <StarIcon 
                                          size={20}
                                          className={
                                            (userRatings[game.id] || 0) >= ratingValue 
                                              ? 'fill-yellow-400' 
                                              : ''
                                          }
                                        />
                                      </motion.button>
                                    );
                                  })}
                                </div>
                                {userRatings[game.id] && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-sm text-gray-400 mt-2"
                                  >
                                    Your rating: {userRatings[game.id]}/5
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="absolute right-6 -top-32 flex flex-col gap-4">
                        <motion.button 
                          className="p-3 bg-black/50 backdrop-blur-sm rounded-full relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLike(game.id)}
                        >
                          <motion.div
                            initial={false}
                            animate={likedGames.has(game.id) ? {
                              scale: [1, 1.5, 1],
                              rotate: [0, -15, 15, 0],
                              transition: { 
                                duration: 0.4,
                                ease: "easeInOut"
                              }
                            } : {}}
                          >
                            <Heart 
                              className={`${
                                likedGames.has(game.id) 
                                  ? 'text-red-500 fill-red-500' 
                                  : 'text-white hover:text-red-500'
                              } transition-colors`}
                              size={24}
                            />
                          </motion.div>

                          {/* Floating Hearts */}
                          {floatingHearts.map(heartId => {
                            if (heartId.startsWith(game.id)) {
                              return (
                                <FloatingHeart
                                  key={heartId}
                                  onComplete={() => {
                                    setFloatingHearts(prev => 
                                      prev.filter(id => id !== heartId)
                                    );
                                  }}
                                />
                              );
                            }
                            return null;
                          })}
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

                      <h3 className="text-xl font-syne text-white mb-3">
                        {game.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {game.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                          <Trophy className="text-[#1a6363]" size={20} />
                          <span className="text-[#1a6363] font-medium">
                            {game.reward}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            relative px-6 py-2 
                            overflow-hidden
                            backdrop-blur-md 
                            border-l-2
                            shadow-inner
                            font-medium 
                            tracking-wider
                            text-white
                            ${game.difficulty === 'Easy' 
                              ? 'bg-emerald-900/20 border-emerald-400/40' 
                              : game.difficulty === 'Medium'
                              ? 'bg-amber-900/20 border-amber-400/40'
                              : 'bg-red-900/20 border-red-400/40'
                            }
                            clip-path-polygon
                          `}
                          style={{
                            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
                          }}
                          onClick={() => handlePlayNow(game)}
                        >
                          {/* Windshield effect */}
                          <div className="absolute inset-0 overflow-hidden">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              animate={{
                                x: ['-100%', '100%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            />
                          </div>
                          
                          {/* Button text */}
                          <span className="relative z-10">Play Now</span>
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

      {showChallenge && selectedGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-[70]"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[400px] bg-[#1a1a1a]/95 backdrop-blur-md rounded-xl overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="relative p-4 border-b border-white/10">
              <motion.button
                className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => setShowChallenge(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="text-white/70" size={16} />
              </motion.button>
              <h3 className="text-lg font-syne text-white">Verify Social Follow</h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Links */}
              <div className="space-y-3">
                      <a 
                        href="https://x.com/xerow_ai" 
                        target="_blank" 
                        rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/90"
                >
                  <div className="p-2 rounded-lg bg-[#1a6363]/20">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  Follow on X
                </a>
                      <a 
                        href="https://t.me/xerow_ai" 
                        target="_blank" 
                        rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/90"
                >
                  <div className="p-2 rounded-lg bg-[#1a6363]/20">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.27-.48.74-.74 2.93-1.27 4.88-2.11 5.87-2.51 2.8-1.14 3.37-1.34 3.75-1.34.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  Join Telegram
                      </a>
                    </div>

              {/* Upload Section */}
              <div className="relative">
                {proofImage ? (
                  <div className="relative rounded-lg overflow-hidden aspect-video bg-black/50">
                    <img 
                      src={URL.createObjectURL(proofImage)} 
                      alt="Proof" 
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Scanning Animation */}
                    {isAnalyzing && (
                      <>
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-b from-[#1a6363]/20 to-transparent"
                          animate={{
                            y: ['0%', '100%', '0%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <div className="absolute inset-0 border-2 border-[#1a6363]/50">
                          <motion.div
                            className="absolute top-0 left-0 w-20 h-20"
                            animate={{
                              x: ['0%', '100%'],
                              y: ['0%', '100%']
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "linear"
                            }}
                          >
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#1a6363]" />
                            <div className="absolute top-0 right-0 w-0.5 h-full bg-[#1a6363]" />
                          </motion.div>
                        </div>
                        
                        {/* Analysis Text */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-[#1a6363] font-mono"
                          >
                            Analyzing proof... {isVerified ? '100%' : ''}
                          </motion.div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-3 p-8 rounded-lg border-2 border-dashed border-white/10 hover:border-[#1a6363]/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <div className="p-3 rounded-full bg-[#1a6363]/20">
                      <svg className="w-6 h-6 text-[#1a6363]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white/70 text-sm">Upload screenshot proof</span>
                  </label>
                )}
                </div>

              {/* Verify Button */}
                <motion.button
                  className={`
                  w-full py-3 rounded-lg font-medium tracking-wider
                    ${proofImage 
                      ? 'bg-[#1a6363] text-white hover:bg-[#1a6363]/90' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }
                    transition-colors
                  `}
                disabled={!proofImage || isAnalyzing}
                  onClick={handleVerification}
                >
                  {isAnalyzing ? 'Verifying...' : 'Verify Follow'}
                </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isVerificationComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] p-6 rounded-xl max-w-sm w-full mx-4 border border-[#1a6363]/20"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-[#1a6363]/20 flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="text-[#1a6363]" size={32} />
              </motion.div>
              <h3 className="text-xl font-syne text-white mb-2">
                Challenge Complete!
              </h3>
              <p className="text-gray-400 mb-6">
                {selectedGame?.reward} has been added to your wallet
              </p>
              <motion.button
                className="px-8 py-3 bg-[#1a6363] text-white rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsVerificationComplete(false);
                  setShowChallenge(false);
                  setProofImage(null);
                  setIsVerified(false);
                }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}; 