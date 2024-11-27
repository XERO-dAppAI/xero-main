import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  PackageSearch,
  BarChart3,
  Wallet,
  Tags,
  Brain,
  Settings,
  User,
  LogOut,
  Search,
  MoreVertical,
  Plus,
  ClipboardList,
  LineChart,
  Trophy,
  Mail,
  X
} from 'lucide-react';
import xeroLogo from '../../assets/xero.png';
import { Account } from './Account';
import { Inventory } from './Inventory';
import { Analytics } from './Analytics';
import { PriceEngine } from './PriceEngine';
import { Ledger } from './Ledger';
import { AIAssistant } from './AIAssistant';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';
import { BusinessProfile } from '../../types/business';

interface SearchResult {
  type: 'inventory' | 'ledger' | 'analytics' | 'price-engine';
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
}

interface SearchableItem {
  id: string;
  type: 'inventory' | 'ledger' | 'analytics' | 'price-engine';
  title: string;
  description: string;
  tags?: string[];
  section: string;
}

export const BusinessDashboard: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('overview');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const sidebarItems = [
    {
      label: 'Overview',
      icon: <LayoutDashboard size={20} />,
      active: currentSection === 'overview'
    },
    {
      label: 'Inventory',
      icon: <PackageSearch size={20} />,
      active: currentSection === 'inventory'
    },
    {
      label: 'Analytics',
      icon: <BarChart3 size={20} />,
      active: currentSection === 'analytics'
    },
    {
      label: 'Price Engine',
      icon: <Tags size={20} />,
      active: currentSection === 'price engine'
    },
    {
      label: 'Ledger',
      icon: <Wallet size={20} />,
      active: currentSection === 'ledger'
    },
    {
      label: 'AI Assistant',
      icon: <Brain size={20} />,
      active: currentSection === 'ai assistant'
    },
    {
      label: 'Account',
      icon: <Settings size={20} />,
      active: currentSection === 'account'
    }
  ];

  useEffect(() => {
    // First try to get from localStorage
    const savedProfile = localStorage.getItem('business_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setBusinessProfile(profile);
      } catch (error) {
        console.error('Error parsing business profile:', error);
      }
    } else {
      // If not in localStorage, try to get from account settings
      const accountProfile = localStorage.getItem('account_settings');
      if (accountProfile) {
        try {
          const profile = JSON.parse(accountProfile);
          setBusinessProfile(profile);
        } catch (error) {
          console.error('Error parsing account settings:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get business initials
  const getBusinessInitials = () => {
    if (!businessProfile?.businessName) return 'XB';
    return businessProfile.businessName
      .split(' ')
      .map((word: string) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleSectionChange = (label: string) => {
    console.log('Changing section to:', label.toLowerCase());
    setCurrentSection(label.toLowerCase());
  };

  const connectWallet = async () => {
    if (!(window as any).ic?.plug) {
      alert("Plug wallet extension not found. Please install it from the Chrome Web Store.");
      window.open("https://chrome.google.com/webstore/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm", "_blank");
      return;
    }

    try {
      const connected = await (window as any).ic.plug.requestConnect({
        host: 'http://localhost:8000',
        timeout: 50000
      });

      if (connected) {
        const principalId = await (window as any).ic.plug.agent.getPrincipal();
        console.log("Connected with principal:", principalId.toText());

        const balance = await (window as any).ic.plug.requestBalance();
        setWalletBalance(balance[0]?.amount || 0);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect to Plug wallet. Please try again.");
    }
  };

  const handleWaitlistClick = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#666ED2', '#7C83E1', '#2D2654']
    });

    // Show success toast
    toast.success('Thanks for your interest! We\'ll notify you when we launch.', {
      style: {
        border: '1px solid #666ED2',
        padding: '16px',
        color: '#2D2654',
      },
      iconTheme: {
        primary: '#666ED2',
        secondary: '#FFFFFF',
      },
      duration: 5000,
    });
  };

  const getAllSearchableContent = (): SearchableItem[] => {
    // This would ideally come from your actual data store
    return [
      // Inventory Items
      {
        id: 'inv-1',
        type: 'inventory',
        title: 'Manage Inventory',
        description: 'View and manage your inventory items',
        tags: ['stock', 'products', 'items', 'inventory management'],
        section: 'inventory'
      },
      {
        id: 'inv-2',
        type: 'inventory',
        title: 'Low Stock Items',
        description: 'View items that need restocking',
        tags: ['low stock', 'reorder', 'inventory alerts'],
        section: 'inventory'
      },
      // Ledger Items
      {
        id: 'led-1',
        type: 'ledger',
        title: 'Recent Transactions',
        description: 'View your latest financial transactions',
        tags: ['transactions', 'finance', 'payments', 'history'],
        section: 'ledger'
      },
      {
        id: 'led-2',
        type: 'ledger',
        title: 'Transaction History',
        description: 'Complete history of all transactions',
        tags: ['history', 'payments', 'records'],
        section: 'ledger'
      },
      // Analytics Items
      {
        id: 'ana-1',
        type: 'analytics',
        title: 'Sales Analytics',
        description: 'View your sales performance metrics',
        tags: ['sales', 'metrics', 'performance', 'reports'],
        section: 'analytics'
      },
      {
        id: 'ana-2',
        type: 'analytics',
        title: 'Inventory Analytics',
        description: 'Analysis of inventory movement and trends',
        tags: ['inventory', 'trends', 'analysis'],
        section: 'analytics'
      },
      // Price Engine Items
      {
        id: 'pe-1',
        type: 'price-engine',
        title: 'Price Rules',
        description: 'Manage your pricing rules and strategies',
        tags: ['pricing', 'rules', 'strategies'],
        section: 'price engine'
      },
      {
        id: 'pe-2',
        type: 'price-engine',
        title: 'Dynamic Pricing',
        description: 'Set up dynamic pricing rules',
        tags: ['dynamic pricing', 'automation', 'price adjustments'],
        section: 'price engine'
      }
    ];
  };

  const getIconForType = (type: string): JSX.Element => {
    switch (type) {
      case 'inventory':
        return <PackageSearch size={20} className="text-[#666ED2]" />;
      case 'ledger':
        return <Wallet size={20} className="text-[#666ED2]" />;
      case 'analytics':
        return <BarChart3 size={20} className="text-[#666ED2]" />;
      case 'price-engine':
        return <Tags size={20} className="text-[#666ED2]" />;
      default:
        return <Search size={20} className="text-[#666ED2]" />;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setShowSearchResults(false);
      return;
    }

    const searchableContent = getAllSearchableContent();
    const queryLower = query.toLowerCase();

    const results = searchableContent.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(queryLower);
      const matchDescription = item.description.toLowerCase().includes(queryLower);
      const matchTags = item.tags?.some(tag => tag.toLowerCase().includes(queryLower));

      return matchTitle || matchDescription || matchTags;
    });

    const searchResults: SearchResult[] = results.map(item => ({
      type: item.type,
      title: item.title,
      description: item.description,
      icon: getIconForType(item.type),
      link: `/${item.section}`
    }));

    setSearchResults(searchResults);
    setShowSearchResults(true);
  };

  const renderContent = (): JSX.Element => {
    switch (currentSection) {
      case 'inventory':
        return <Inventory />;
      case 'analytics':
        return <Analytics />;
      case 'price engine':
        return <PriceEngine />;
      case 'ledger':
        return <Ledger />;
      case 'ai assistant':
        return <AIAssistant />;
      case 'account':
        return <Account />;
      case 'overview':
        return (
          <div className="max-w-[1000px] mx-auto">
            {/* Welcome Message */}
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-syne text-[#2D2654] mb-2"
              >
                Welcome back, {businessProfile?.businessName || businessProfile?.business?.name || 'Entrepreneur'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500"
              >
                {businessProfile ? 
                  `Manage your ${businessProfile?.businessType || businessProfile?.business?.type || 'business'} operations and explore new features` 
                  : 'Manage your business operations and explore new features'
                }
              </motion.p>
            </div>

            {/* Wallet Card */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#666ED2] to-[#7C83E1] rounded-2xl p-8 text-white relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute left-0 bottom-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-xl font-syne mb-2">Wallet Balance</h2>
                      <p className="text-white/70 text-sm">Connect your wallet to manage ICP</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Wallet size={24} />
                    </div>
                  </div>

                  {walletBalance !== null ? (
                    <div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-syne">{(walletBalance / 100000000).toFixed(2)}</span>
                        <span className="text-xl">ICP</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">Connected to Plug Wallet</span>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl font-syne mb-4">---.-- ICP</p>
                      <button
                        onClick={connectWallet}
                        className="px-6 py-3 bg-white text-[#666ED2] rounded-xl flex items-center gap-2 hover:bg-white/90 transition-colors w-fit"
                      >
                        <Wallet size={20} />
                        Connect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Pro Features Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-syne text-[#2D2654] mb-2">Upgrade to Pro</h2>
                  <p className="text-gray-500">Get access to exclusive features and benefits</p>
                </div>
                <div className="px-4 py-1.5 bg-gradient-to-r from-[#666ED2] to-[#7C83E1] text-white rounded-full text-sm">
                  Coming Soon
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: 'XERO Marketplace',
                    description: 'Connect with suppliers and expand your business network',
                    icon: <Tags className="text-[#666ED2]" size={24} />
                  },
                  {
                    title: 'XEROW Coin',
                    description: 'Exclusive cryptocurrency for XERO ecosystem',
                    icon: <Wallet className="text-[#666ED2]" size={24} />
                  },
                  {
                    title: 'XERO League',
                    description: 'Compete with other businesses and earn rewards',
                    icon: <Trophy className="text-[#666ED2]" size={24} />
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-xl bg-[#F8F9FF] border border-transparent hover:border-[#666ED2]/30 transition-all"
                  >
                    <div className="p-3 bg-white rounded-lg w-fit mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-syne text-[#2D2654] mb-2">{feature.title}</h3>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={handleWaitlistClick}
                  className="px-8 py-3 bg-[#666ED2] text-white rounded-xl flex items-center gap-2 mx-auto hover:bg-[#666ED2]/90 transition-colors"
                >
                  <Mail size={20} />
                  Join the Waitlist
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Be the first to know when we launch our pro features
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={xeroLogo} alt="XERO" className="w-12" />
              <h1 className="text-2xl font-syne text-[#2D2654]">Dashboard</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative flex-1 max-w-xl mx-4">
                <div className="relative">
                  <Search 
                    size={20} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    placeholder="Search dashboard..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-[#F8F9FF] border border-gray-100 focus:border-[#666ED2] focus:ring-1 focus:ring-[#666ED2] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 hover:bg-[#F8F9FF] cursor-pointer"
                            onClick={() => {
                              handleSectionChange(result.type);
                              setShowSearchResults(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#F8F9FF] rounded-lg">
                                {result.icon}
                              </div>
                              <div>
                                <h4 className="text-sm font-syne text-[#2D2654]">{result.title}</h4>
                                <p className="text-xs text-gray-500">{result.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              <motion.div 
                className="w-10 h-10 rounded-full bg-[#666ED2] text-white flex items-center justify-center font-syne cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSectionChange('account')}
              >
                {getBusinessInitials()}
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-72px)] border-r border-gray-100">
          <nav className="p-6 flex flex-col h-full">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => handleSectionChange(item.label)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${
                  item.active
                    ? 'bg-[#666ED2] text-white'
                    : 'text-[#2D2654] hover:bg-[#666ED2]/5'
                } transition-colors`}
                whileHover={{ x: 4 }}
              >
                {item.icon}
                <span className="font-raleway">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}; 