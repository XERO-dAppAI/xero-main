import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart, Share2, Star, X, Copy } from 'lucide-react';
import game1 from '../../assets/game1.png';
import game2 from '../../assets/game2.png';
import game3 from '../../assets/game3.png';
import game4 from '../../assets/game4.png';
import game7 from '../../assets/game7.png';
import game8 from '../../assets/game8.png';
import { Star as StarIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

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

// Update the getQuestContent function
const getQuestContent = (gameId: string) => {
  const referralCode = `XERO${Date.now().toString(36).toUpperCase()}`;
  
  switch (gameId) {
    case '1':
      return {
        title: 'Verify Social Follow',
        description: 'Join our community of food waste warriors! Follow us on X and Telegram to stay updated on the latest initiatives.',
        buttons: [
          {
            title: 'Follow on X',
            link: 'https://x.com/xerow_ai',
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            )
          },
          {
            title: 'Join Telegram',
            link: 'https://t.me/xerow_ai',
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.27-.48.74-.74 2.93-1.27 4.88-2.11 5.87-2.51 2.8-1.14 3.37-1.34 3.75-1.34.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            )
          }
        ],
        needsProof: true,
        uploadText: 'Upload screenshot proof'
      };
    case '2':
      return {
        title: 'Join the XERO Alliance',
        description: '',
        referralCode,
        shareMessage: `🌟 Join the XERO Alliance! 

Level up your business and become a Food Waste Warrior! 🎮

Use my special activation code to begin your journey:
${referralCode}

Join the mission: https://xero.com/join

#XEROAlliance #FoodWasteWarrior ⚔️`,
        needsProof: false,
        isReferralQuest: true,
        shareImage: game2
      };
    case '3':
      return {
        title: 'The Gathering of Sacred Ingredients',
        description: `Your mission: Venture into our partnered supermarkets and collect sacred ingredients! 🌟

• Find imperfect produce 🍎
• Choose minimal packaging ✨
• Purchase in bulk 📦
• Save near-expiry items ⚔️`,
        needsProof: true,
        uploadText: 'Upload purchase receipt',
        reward: '200 XEROW',
        requirements: [
          'Visit a XERO-partnered supermarket',
          'Purchase sustainable items',
          'Upload receipt as proof'
        ]
      };
    case '4':
      return {
        title: 'The Food Waste Wisdom Challenge',
        description: `The XERO Guild needs you! 🌟 To become a true hero in the battle against food waste, you must show your wisdom in this food waste trivia challenge. Test your knowledge and earn your reward! 🧠✨`,
        needsProof: false,
        isQuizQuest: true,
        questions: [
          {
            text: 'What percentage of food produced globally is wasted by businesses each year?',
            options: [
              { id: 'A', text: '10%', hint: 'A small number, but still plenty of food slipping through the cracks!' },
              { id: 'B', text: '20%', hint: 'Almost a fifth of all food! That\'s a lot of potential waste.' },
              { id: 'C', text: '30%', hint: 'A third of all food produced globally is wasted! A serious problem for businesses and the planet.' }
            ],
            correctAnswer: 'C',
            explanation: 'Around 30% of food produced globally is wasted each year, much of it by businesses due to overproduction, spoilage, and inefficiencies in supply chains.'
          },
          {
            text: 'What is the biggest problem businesses face when it comes to food waste?',
            options: [
              { id: 'A', text: 'Expiring Products', hint: 'Items left on shelves too long, reaching their expiry date.' },
              { id: 'B', text: 'Poor Demand Forecasting', hint: 'Not knowing how much food to buy or prepare leads to excess.' },
              { id: 'C', text: 'Lack of Storage Space', hint: 'Having enough room to keep everything fresh and safe.' }
            ],
            correctAnswer: 'B',
            explanation: 'Many businesses overestimate demand, resulting in excess food that ends up wasted due to spoilage. Accurate forecasting can reduce this.'
          },
          {
            text: 'Which country wastes the most food annually?',
            options: [
              { id: 'A', text: 'United States', hint: 'A country of plenty, but a shocking amount of food goes to waste.' },
              { id: 'B', text: 'Japan', hint: 'Even Japan, known for its precision, struggles with food waste.' },
              { id: 'C', text: 'India', hint: 'A country with one of the highest levels of food insecurity, but also significant food loss.' }
            ],
            correctAnswer: 'A',
            explanation: 'The US is one of the leading countries in food waste, with around 40% of food produced being wasted each year, much of it at the consumer and business level.'
          }
        ]
      };
    case '5':
      return {
        title: 'Sustainability Practice',
        description: 'Discover and implement sustainable practices in your business operations to reduce food waste and environmental impact.',
        needsProof: true,
        uploadText: 'Upload completion proof'
      };
    case '6':
      return {
        title: 'Resource Optimization',
        description: 'Learn advanced techniques for optimizing resource allocation and stock management.',
        needsProof: true,
        uploadText: 'Upload completion proof'
      };
    case '7':
      return {
        title: 'Supply Chain Management',
        description: 'Master the complexities of food supply chain management and implement efficient distribution strategies.',
        needsProof: true,
        uploadText: 'Upload completion proof'
      };
    case '8':
      return {
        title: 'Food Preservation Mastery',
        description: 'Learn advanced food preservation techniques and implement them in your business operations.',
        needsProof: true,
        uploadText: 'Upload completion proof'
      };
    case '9':
      return {
        title: 'Community Building',
        description: 'Build and strengthen local business networks to create an efficient food redistribution system.',
        needsProof: true,
        uploadText: 'Upload completion proof'
      };
    case '10':
      return {
        title: 'Zero Waste Achievement',
        description: 'Complete the final challenge by implementing all learned strategies to achieve zero waste status.',
        needsProof: true,
        uploadText: 'Upload completion proof'
      };
    default:
      return null;
  };
};

// Add these helper functions
const triggerSuccessEffect = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

const triggerErrorEffect = () => {
  // Shake animation will be handled by motion
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
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasCodeBeenCopied, setHasCodeBeenCopied] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [questReward, setQuestReward] = useState<number>(0); // Start at 0 and increment based on performance
  const [deductions, setDeductions] = useState<string[]>([]); // Track reasons for deductions
  const [showHintConfirm, setShowHintConfirm] = useState<string | null>(null);

  // Add new state variables for Quest 3
  const [quest3Image, setQuest3Image] = useState<File | null>(null);
  const [quest3ImagePreview, setQuest3ImagePreview] = useState<string | null>(null);
  const [quest3IsAnalyzing, setQuest3IsAnalyzing] = useState(false);
  const [quest3IsVerified, setQuest3IsVerified] = useState(false);

  // Add new state for tracking correct answers
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const games: Game[] = [
    {
      id: '1',
      title: 'Social Media Awakening',
      description: 'Join the XERO Alliance in our quest to eliminate food waste! Your first mission: Connect with fellow food waste warriors on X and Telegram. Together, we\'ll forge a future where no food goes to waste! 🌟🍱',
      reward: '100 XEROW',
      rating: 8.83,
      episodes: 24,
      image: game1,
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Referral Sage',
      description: 'Spread the word about XERO\'s mission! As food waste warriors, we need more allies in our quest. Share your unique referral code and help build our community of conscious traders! 🤝✨',
      reward: '150 XEROW',
      rating: 8.62,
      episodes: 12,
      image: game2,
      difficulty: 'Easy'
    },
    {
      id: '3',
      title: 'The Gathering of Sacred Ingredients',
      description: 'Embark on a mystical quest to rescue imperfect produce and master the art of sustainable shopping! Seek out unconventional ingredients and prove your worth to the XERO Guild. 🍎✨',
      reward: '200 XEROW',
      rating: 9.1,
      episodes: 15,
      image: game3,
      difficulty: 'Medium'
    },
    {
      id: '4',
      title: 'The Food Waste Wisdom Challenge',
      description: 'Test your knowledge in this mystical food waste trivia challenge! Answer wisely, as each hint will cost you precious XEROW coins. 🧠✨',
      reward: '300 XEROW',
      rating: 9.2,
      episodes: 3,
      image: game4,
      difficulty: 'Hard'
    },
    {
      id: '5',
      title: 'Sustainability Champion',
      description: 'Channel the energy of sustainable practices! Learn to transform potential food waste into valuable resources. Every morsel saved is a victory for our planet! 🌱🔮',
      reward: '90 XEROW',
      rating: 8.71,
      episodes: 15,
      image: game3,
      difficulty: 'Easy'
    },
    {
      id: '6',
      title: 'Resource Sage',
      description: 'Unlock the secrets of resource optimization! Master the mystical balance between stock levels and customer demand. Minimize waste, maximize impact! ⚖️✨',
      reward: '85 XEROW',
      rating: 8.88,
      episodes: 20,
      image: game4,
      difficulty: 'Medium'
    },
    {
      id: '7',
      title: 'Food Chain Warrior',
      description: 'Embark on an epic quest through the supply chain! Battle inefficiencies and rescue food from the clutches of waste. Your strategy will reshape the future! ⚔️🍜',
      reward: '150 XEROW',
      rating: 9.12,
      episodes: 16,
      image: game7,
      difficulty: 'Hard'
    },
    {
      id: '8',
      title: 'Preservation Master',
      description: 'Learn legendary techniques of food preservation! Master the ancient arts of storage and handling to extend food life. Every preserved item is a battle won! 🌟❄️',
      reward: '110 XEROW',
      rating: 8.79,
      episodes: 22,
      image: game8,
      difficulty: 'Medium'
    },
    {
      id: '9',
      title: 'Community Alliance',
      description: 'Unite local businesses in the fight against waste! Build networks to share and redistribute surplus food. Together, we are stronger! 🤝🍱',
      reward: '95 XEROW',
      rating: 8.91,
      episodes: 14,
      image: game7,
      difficulty: 'Easy'
    },
    {
      id: '10',
      title: 'Zero Waste Legend',
      description: 'The ultimate challenge awaits! Combine all your learned skills to achieve the legendary status of Zero Waste Master. Your legacy will inspire generations! 👑🌟',
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
    // Check if game is 5 or higher (future games)
    if (parseInt(game.id) >= 5) {
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#1a1a1a] p-4 rounded-xl border border-[#1a6363]/20 shadow-xl max-w-md w-[90%] mx-auto"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#1a6363]/20">
              <svg 
                className="w-6 h-6 text-[#1a6363]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
              />
            </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Coming Soon!</h3>
              <p className="text-white/70 text-sm">
                The blockchain queens are behind the scenes crafting more gaming episodes. Stay tuned for epic challenges! ✨
              </p>
            </div>
            <button 
              onClick={() => toast.dismiss(t.id)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      ), {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    // Rest of the existing handlePlayNow logic
    // Check if previous challenge is completed (except for first challenge)
    const gameIndex = games.findIndex(g => g.id === game.id);
    if (gameIndex > 0) {
      const previousGame = games[gameIndex - 1];
      if (!completedChallenges.has(previousGame.id)) {
        toast.error('Complete the previous challenge first!');
        return;
      }
    }

    // Check if already completed
    if (completedChallenges.has(game.id)) {
      toast.success('Challenge already completed!');
      return;
    }

    setSelectedGame(game);
    setShowChallenge(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid receipt image or PDF');
        return;
      }

      setProofImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleVerification = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerified(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAnalyzing(false);
    setIsVerificationComplete(true);
    
    // Add to completed challenges
    if (selectedGame) {
      setCompletedChallenges(prev => new Set([...prev, selectedGame.id]));
    }
  };

  const handleReferralShare = () => {
    const referralMessage = `🌟 Join me in the fight against food waste with XERO! 

We're building a community of conscious traders working to reduce food waste through innovative solutions.

Use my referral code: XERO${selectedGame?.id}${Date.now().toString(36)} to get started!

Join here: https://xero.com/join
`;

    if (navigator.share) {
      navigator.share({
        title: 'Join XERO',
        text: referralMessage,
        url: 'https://xero.com/join'
      });
    } else {
      navigator.clipboard.writeText(referralMessage);
      toast.success('Referral message copied to clipboard!');
    }
  };

  const handleHintReveal = (e: React.MouseEvent, questionIndex: number, optionId: string) => {
    e.stopPropagation();
    setRevealedHints(prev => new Set([...prev, `${questionIndex}-${optionId}`]));
    // Deduct 10 XEROW for using a hint
    setQuestReward(prev => prev - 10);
    setDeductions(prev => [...prev, `Used hint (-10 XEROW)`]);
  };

  const handleAnswerSelect = (option: any) => {
    if (!selectedAnswers[currentQuestionIndex]) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: option.id
      }));
      setShowExplanation(true);

      if (option.id === getQuestContent('4')?.questions[currentQuestionIndex].correctAnswer) {
        // Correct answer
        triggerSuccessEffect();
        setCorrectAnswers(prev => prev + 1);
        // Each correct answer is worth 100 XEROW
        setQuestReward(prev => prev + 100);
      } else {
        // Wrong answer - deduct 20 XEROW
        triggerErrorEffect();
        setQuestReward(prev => prev - 20);
        setDeductions(prev => [...prev, `Wrong answer (-20 XEROW)`]);
      }
    }
  };

  // Add a new handler for Quest 3 image upload
  const handleQuest3ImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid receipt image or PDF');
        return;
      }

      setQuest3Image(file);
      const previewUrl = URL.createObjectURL(file);
      setQuest3ImagePreview(previewUrl);
    }
  };

  // Add a new handler for Quest 3 verification
  const handleQuest3Verification = async () => {
    setQuest3IsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setQuest3IsVerified(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setQuest3IsAnalyzing(false);
    setIsVerificationComplete(true);
    
    if (selectedGame) {
      setCompletedChallenges(prev => new Set([...prev, selectedGame.id]));
    }
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
                          whileHover={{ scale: completedChallenges.has(game.id) ? 1 : 1.05 }}
                          whileTap={{ scale: completedChallenges.has(game.id) ? 1 : 0.95 }}
                          className={`
                            relative px-6 py-2 
                            overflow-hidden
                            backdrop-blur-md 
                            border-l-2
                            shadow-inner
                            font-medium 
                            tracking-wider
                            text-white
                            ${completedChallenges.has(game.id)
                              ? 'bg-gray-500/20 border-gray-400/40 cursor-not-allowed'
                              : game.difficulty === 'Easy'
                              ? 'bg-emerald-900/20 border-emerald-400/40'
                              : game.difficulty === 'Medium'
                              ? 'bg-amber-900/20 border-amber-400/40'
                              : 'bg-red-900/20 border-red-400/40'
                            }
                            ${!completedChallenges.has(games[games.findIndex(g => g.id === game.id) - 1]?.id) && game.id !== '1'
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                            }
                            clip-path-polygon
                          `}
                          style={{
                            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
                          }}
                          onClick={() => handlePlayNow(game)}
                        >
                          {/* Windshield effect - only show if not completed */}
                          {!completedChallenges.has(game.id) && (
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
                          )}
                          
                          {/* Button text */}
                          <span className="relative z-10">
                            {completedChallenges.has(game.id) 
                              ? 'Completed ✓' 
                              : !completedChallenges.has(games[games.findIndex(g => g.id === game.id) - 1]?.id) && game.id !== '1'
                              ? 'Locked 🔒'
                              : 'Play Now'
                            }
                          </span>
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
              <h3 className="text-lg font-syne text-white">
                {getQuestContent(selectedGame.id)?.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="bg-[#1a6363]/10 p-4 rounded-lg">
                <p className="text-white/90 text-sm leading-relaxed">
                  {getQuestContent(selectedGame.id)?.description}
                </p>
              </div>

              {selectedGame?.id === '1' ? (
                // Social Media Quest Content
                <>
                  <div className="space-y-3">
                    {getQuestContent('1')?.buttons?.map((button, index) => (
                      <a 
                        key={index}
                        href={button.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/90"
                      >
                        <div className="p-2 rounded-lg bg-[#1a6363]/20">
                          {button.icon}
                        </div>
                        {button.title}
                      </a>
                    ))}
                  </div>
                  
                  {/* Upload Proof Section for Quest 1 */}
                  <div>
                    {imagePreview ? (
                      <div className="relative rounded-lg overflow-hidden aspect-video">
                        <img 
                          src={imagePreview} 
                          alt="Proof" 
                          className="w-full h-full object-contain bg-black/50"
                        />
                        
                        {isAnalyzing && (
                          <>
                            {/* Existing scanning animation code */}
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
                        <span className="text-white/70 text-sm">
                          {getQuestContent(selectedGame.id)?.uploadText}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Verify Button for Quest 1 */}
                  <motion.button
                    className={`
                      w-full py-3 rounded-lg font-medium tracking-wider
                      ${imagePreview 
                        ? 'bg-[#1a6363] text-white hover:bg-[#1a6363]/90' 
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }
                      transition-colors
                    `}
                    disabled={!imagePreview || isAnalyzing}
                    onClick={handleVerification}
                  >
                    {isAnalyzing ? 'Verifying...' : 'Verify Quest'}
                  </motion.button>
                </>
              ) : selectedGame?.id === '2' ? (
                // Referral Quest Content
                <div className="h-full flex flex-col">
                  {/* Preview Card */}
                  <div className="flex-1 bg-[#1a1a1a] p-4 rounded-lg overflow-hidden">
                    <img 
                      src={game2} 
                      alt="XERO Community" 
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="text-white/70 text-sm whitespace-pre-line max-h-[120px] overflow-y-auto">
                      {getQuestContent('2')?.shareMessage}
                    </div>
                  </div>

                  {/* Action Buttons - Side by Side */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {/* Copy Message Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const shareMessage = getQuestContent('2')?.shareMessage;
                        if (shareMessage) {
                          navigator.clipboard.writeText(shareMessage);
                          toast.success('Message copied!');
                          setHasCodeBeenCopied(true); // Set copied state to true
                        }
                      }}
                      className={`
                        p-2.5 rounded-lg relative overflow-hidden group
                        backdrop-blur-md 
                        border-l-2
                        shadow-inner
                        font-medium 
                        tracking-wider
                        bg-emerald-900/20 border-emerald-400/40 text-emerald-300/90
                        clip-path-polygon
                        text-sm
                      `}
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
                      <div className="relative flex items-center justify-center gap-2">
                        <Copy size={16} />
                        <span>Copy Code</span>
                      </div>
                    </motion.button>

                    {/* Complete Quest Button */}
                    <motion.button
                      whileHover={{ scale: hasCodeBeenCopied ? 1.02 : 1 }}
                      whileTap={{ scale: hasCodeBeenCopied ? 0.98 : 1 }}
                      onClick={() => {
                        if (hasCodeBeenCopied) {
                          setCompletedChallenges(prev => new Set([...prev, '2']));
                          setShowChallenge(false);
                          setIsVerificationComplete(true);
                        }
                      }}
                      className={`
                        p-2.5 rounded-lg relative overflow-hidden group
                        backdrop-blur-md 
                        border-l-2
                        shadow-inner
                        font-medium 
                        tracking-wider
                        ${hasCodeBeenCopied 
                          ? 'bg-red-900/20 border-red-400/40 text-red-300/90 cursor-pointer'
                          : 'bg-gray-900/20 border-gray-400/20 text-gray-400/50 cursor-not-allowed'
                        }
                        clip-path-polygon
                        text-sm
                      `}
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Shine effect - only show if button is active */}
                      {hasCodeBeenCopied && (
                        <div className="absolute inset-0 overflow-hidden">
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
                      )}
                      <div className="relative flex items-center justify-center gap-2">
                        <Trophy size={16} />
                        <span>Complete</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              ) : selectedGame?.id === '3' ? (
                // Standard Quest Content with Upload
                getQuestContent('3')?.needsProof && (
                  <>
                    <div className="space-y-4">
                      {/* Requirements List */}
                      <div className="bg-[#1a1a1a] p-4 rounded-lg">
                        <h4 className="text-white/90 text-sm font-medium mb-2">Quest Requirements:</h4>
                        <ul className="space-y-2">
                          {getQuestContent('3')?.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-white/70">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#1a6363]" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Upload Section */}
                      <div>
                        {quest3ImagePreview ? (
                          <div className="relative rounded-lg overflow-hidden aspect-video">
                            <img 
                              src={quest3ImagePreview} 
                              alt="Receipt" 
                              className="w-full h-full object-contain bg-black/50"
                            />
                            
                            {quest3IsAnalyzing && (
                              <>
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-b from-[#1a6363]/20 via-transparent to-[#1a6363]/20"
                                  animate={{
                                    y: ['0%', '100%', '0%'],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                  }}
                                />
                                
                                <div className="absolute bottom-4 left-4 right-4">
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-mono"
                                    style={{
                                      color: '#1a6363',
                                      textShadow: '0 0 10px rgba(26,99,99,0.5)'
                                    }}
                                  >
                                    Verifying receipt... {quest3IsVerified ? '100%' : ''}
                                  </motion.div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-[#1a6363]/30 hover:border-[#1a6363]/50 transition-colors bg-[#1a6363]/5 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*,.pdf,.jpg,.jpeg,.png,.heic"
                              onChange={handleQuest3ImageUpload}
                              className="hidden"
                            />
                            <div className="p-3 rounded-full bg-[#1a6363]/20">
                              <svg className="w-6 h-6 text-[#1a6363]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-[#1a6363] text-sm font-medium">
                              Click to upload receipt
                            </span>
                            <span className="text-[#1a6363]/60 text-xs">
                              Supports: JPG, PNG, PDF
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Verify Button */}
                      <motion.button
                        className={`
                          w-full py-3 rounded-lg font-medium tracking-wider
                          ${quest3ImagePreview 
                            ? 'bg-[#1a6363] text-white hover:bg-[#1a6363]/90' 
                            : 'bg-[#1a6363]/20 text-[#1a6363]/50 cursor-not-allowed'
                          }
                          transition-colors
                        `}
                        disabled={!quest3ImagePreview || quest3IsAnalyzing}
                        onClick={handleQuest3Verification}
                      >
                        {quest3IsAnalyzing ? 'Verifying Receipt...' : 'Verify Purchase'}
                      </motion.button>
                    </div>
                  </>
                )
              ) : selectedGame?.id === '4' && getQuestContent('4')?.isQuizQuest ? (
                <div className="space-y-4">
                  {/* Current Question Card */}
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-[#1a1a1a] p-6 rounded-lg relative overflow-hidden"
                  >
                    {/* Add ambient glow effect */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-[#1a6363]/10 via-transparent to-transparent"
                      style={{
                        filter: 'blur(40px)',
                        transform: 'translate(-50%, -50%) scale(2)',
                      }}
                    />

                    {/* Question Progress with enhanced styling */}
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <h4 className="text-white/90 font-medium">
                        Question {currentQuestionIndex + 1} of {getQuestContent('4')?.questions.length}
                      </h4>
                      <div className="flex gap-1">
                        {getQuestContent('4')?.questions.map((_, index) => (
                          <motion.div 
                            key={index}
                            className={`h-1.5 w-10 rounded-full transition-all duration-300 ${
                              index === currentQuestionIndex 
                                ? 'bg-[#1a6363]' 
                                : index < currentQuestionIndex
                                ? 'bg-[#1a6363]/50'
                                : 'bg-white/10'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Question Text with enhanced styling */}
                    <motion.p 
                      className="text-white/90 text-lg mb-6 relative z-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {getQuestContent('4')?.questions[currentQuestionIndex].text}
                    </motion.p>

                    {/* Options with enhanced interactivity */}
                    <div className="space-y-3 relative z-10">
                      {getQuestContent('4')?.questions[currentQuestionIndex].options.map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={!!selectedAnswers[currentQuestionIndex]}
                          className={`
                            w-full p-4 rounded-lg relative overflow-hidden group
                            backdrop-blur-md border-l-2 shadow-inner
                            font-medium tracking-wider
                            ${selectedAnswers[currentQuestionIndex] === option.id
                              ? option.id === getQuestContent('4')?.questions[currentQuestionIndex].correctAnswer
                                ? 'bg-emerald-900/20 border-emerald-400/40 text-emerald-300'
                                : 'bg-red-900/20 border-red-400/40 text-red-300'
                              : selectedAnswers[currentQuestionIndex]
                                ? 'bg-white/5 border-white/10 text-white/30'
                                : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'
                            }
                            transition-all duration-300
                          `}
                        >
                          {/* Hover glow effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                          </div>

                          {/* Content */}
                          <div className="flex items-center justify-between relative z-10">
                            <span className="flex items-center gap-2">
                              <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center
                                ${selectedAnswers[currentQuestionIndex] === option.id
                                  ? option.id === getQuestContent('4')?.questions[currentQuestionIndex].correctAnswer
                                    ? 'bg-emerald-500/20'
                                    : 'bg-red-500/20'
                                  : 'bg-white/10'
                                }
                              `}>
                                {option.id}
                              </div>
                              {option.text}
                            </span>

                            {!revealedHints.has(`${currentQuestionIndex}-${option.id}`) && 
                             !selectedAnswers[currentQuestionIndex] && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowHintConfirm(`${currentQuestionIndex}-${option.id}`);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-full bg-[#1a6363]/20 hover:bg-[#1a6363]/30 transition-colors"
                              >
                                <svg 
                                  className="w-4 h-4 text-[#1a6363]" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" 
                                  />
                                </svg>
                              </motion.button>
                            )}
                          </div>

                          {/* Hint Confirmation Dialog */}
                          {showHintConfirm === `${currentQuestionIndex}-${option.id}` && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[100]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowHintConfirm(null);
                              }}
                            >
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#1a1a1a] p-6 rounded-xl border border-[#1a6363]/20 w-[90%] max-w-sm mx-4 shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-white/90 font-medium">Use Hint?</h4>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowHintConfirm(null)}
                                    className="p-1 rounded-lg hover:bg-white/5"
                                  >
                                    <X size={16} className="text-white/60" />
                                  </motion.button>
                                </div>
                                
                                <p className="text-white/60 text-sm mb-6">
                                  This will cost you <span className="text-[#1a6363] font-medium">10 XEROW</span> coins. 
                                  Are you sure you want to reveal the hint?
                                </p>
                                
                                <div className="flex gap-3">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowHintConfirm(null)}
                                    className="flex-1 py-2.5 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors"
                                  >
                                    Cancel
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                      handleHintReveal(e, currentQuestionIndex, option.id);
                                      setShowHintConfirm(null);
                                    }}
                                    className="flex-1 py-2.5 rounded-lg bg-[#1a6363] text-white text-sm hover:bg-[#1a6363]/90 transition-colors"
                                  >
                                    Use Hint
                                  </motion.button>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}

                          {/* Hint text display - update the styling */}
                          {revealedHints.has(`${currentQuestionIndex}-${option.id}`) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[100]"
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1a1a] p-6 rounded-xl border border-[#1a6363]/20 w-[90%] max-w-sm mx-4 shadow-xl"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-white/90 font-medium">Hint</h4>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setRevealedHints(prev => {
                                      const newHints = new Set(prev);
                                      newHints.delete(`${currentQuestionIndex}-${option.id}`);
                                      return newHints;
                                    })}
                                    className="p-1 rounded-lg hover:bg-white/5"
                                  >
                                    <X size={16} className="text-white/60" />
                                  </motion.button>
                                </div>

                                <div className="flex items-center gap-2 text-[#1a6363] text-sm mb-3">
                                  <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                  </svg>
                                  <span className="font-medium">-10 XEROW Used</span>
                                </div>

                                <p className="text-white/80 text-sm p-4 bg-[#1a6363]/10 rounded-lg border border-[#1a6363]/20">
                                  "{option.hint}"
                                </p>

                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setRevealedHints(prev => {
                                    const newHints = new Set(prev);
                                    newHints.delete(`${currentQuestionIndex}-${option.id}`);
                                    return newHints;
                                  })}
                                  className="mt-4 w-full py-2.5 rounded-lg bg-[#1a6363] text-white text-sm hover:bg-[#1a6363]/90 transition-colors"
                                >
                                  Got it
                                </motion.button>
                              </motion.div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Explanation & Next Button with enhanced styling */}
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-lg bg-[#1a6363]/10 border border-[#1a6363]/20
                          backdrop-blur-md relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a6363]/5 to-transparent" />
                        <p className="text-white/80 text-sm relative z-10 mb-4">
                          {getQuestContent('4')?.questions[currentQuestionIndex].explanation}
                        </p>

                        {/* Show deductions if any */}
                        {deductions.length > 0 && (
                          <div className="mt-4 p-3 bg-black/20 rounded-lg">
                            <h5 className="text-white/60 text-xs mb-2">Deductions:</h5>
                            <ul className="space-y-1">
                              {deductions.map((deduction, index) => (
                                <li key={index} className="text-red-400/80 text-xs">
                                  {deduction}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 pt-2 border-t border-white/10 text-sm">
                              <span className="text-white/60">Current Reward: </span>
                              <span className="text-[#1a6363]">{questReward} XEROW</span>
                            </div>
                          </div>
                        )}

                        {/* Next/Complete button */}
                        {currentQuestionIndex < (getQuestContent('4')?.questions.length || 0) - 1 ? (
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setCurrentQuestionIndex(prev => prev + 1);
                              setShowExplanation(false);
                            }}
                            className="mt-4 w-full py-3 bg-[#1a6363] text-white rounded-lg font-medium
                              relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative z-10">Next Question</span>
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setCompletedChallenges(prev => new Set([...prev, '4']));
                              setShowChallenge(false);
                              setIsVerificationComplete(true);
                              // Final celebration
                              confetti({
                                particleCount: 200,
                                spread: 100,
                                origin: { y: 0.6 }
                              });
                            }}
                            className="mt-4 w-full py-3 bg-[#1a6363] text-white rounded-lg font-medium
                              relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative z-10">
                              Complete Challenge ({questReward} XEROW)
                            </span>
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              ) : (
                // Standard Quest Content with Upload
                getQuestContent(selectedGame.id)?.needsProof && (
                  <>
                    <div className="space-y-4">
                      {/* Requirements List */}
                      <div className="bg-[#1a1a1a] p-4 rounded-lg">
                        <h4 className="text-white/90 text-sm font-medium mb-2">Quest Requirements:</h4>
                        <ul className="space-y-2">
                          {getQuestContent('3')?.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-white/70">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#1a6363]" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Upload Section */}
                      <div>
                        {quest3ImagePreview ? (
                          <div className="relative rounded-lg overflow-hidden aspect-video">
                            <img 
                              src={quest3ImagePreview} 
                              alt="Receipt" 
                              className="w-full h-full object-contain bg-black/50"
                            />
                            
                            {quest3IsAnalyzing && (
                              <>
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-b from-[#1a6363]/20 via-transparent to-[#1a6363]/20"
                                  animate={{
                                    y: ['0%', '100%', '0%'],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                  }}
                                />
                                
                                <div className="absolute bottom-4 left-4 right-4">
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-mono"
                                    style={{
                                      color: '#1a6363',
                                      textShadow: '0 0 10px rgba(26,99,99,0.5)'
                                    }}
                                  >
                                    Verifying receipt... {quest3IsVerified ? '100%' : ''}
                                  </motion.div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-[#1a6363]/30 hover:border-[#1a6363]/50 transition-colors bg-[#1a6363]/5 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*,.pdf,.jpg,.jpeg,.png,.heic"
                              onChange={handleQuest3ImageUpload}
                              className="hidden"
                            />
                            <div className="p-3 rounded-full bg-[#1a6363]/20">
                              <svg className="w-6 h-6 text-[#1a6363]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-[#1a6363] text-sm font-medium">
                              Click to upload receipt
                            </span>
                            <span className="text-[#1a6363]/60 text-xs">
                              Supports: JPG, PNG, PDF
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Verify Button */}
                      <motion.button
                        className={`
                          w-full py-3 rounded-lg font-medium tracking-wider
                          ${quest3ImagePreview 
                            ? 'bg-[#1a6363] text-white hover:bg-[#1a6363]/90' 
                            : 'bg-[#1a6363]/20 text-[#1a6363]/50 cursor-not-allowed'
                          }
                          transition-colors
                        `}
                        disabled={!quest3ImagePreview || quest3IsAnalyzing}
                        onClick={handleQuest3Verification}
                      >
                        {quest3IsAnalyzing ? 'Verifying Receipt...' : 'Verify Purchase'}
                      </motion.button>
                    </div>
                  </>
                )
              )}
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