import React, { useState, useEffect } from 'react';
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
  LineChart
} from 'lucide-react';
import xeroLogo from '../../assets/xero.png';
import { Account } from './Account';
import { Inventory } from './Inventory';
import { Analytics } from './Analytics';

export const BusinessDashboard: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('overview');
  const [businessProfile, setBusinessProfile] = useState<any>(null);

  useEffect(() => {
    // Load business profile from localStorage
    const savedProfile = localStorage.getItem('business_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setBusinessProfile(profile);
    }
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

  const sidebarItems = [
    { icon: <LayoutDashboard size={24} />, label: 'Overview', active: currentSection === 'overview' },
    { icon: <PackageSearch size={24} />, label: 'Inventory', active: currentSection === 'inventory' },
    { icon: <BarChart3 size={24} />, label: 'Analytics', active: currentSection === 'analytics' },
    { icon: <Wallet size={24} />, label: 'Ledger', active: currentSection === 'ledger' },
    { icon: <Tags size={24} />, label: 'Price Engine', active: currentSection === 'price engine' },
    { icon: <Brain size={24} />, label: 'AI Assistant', active: currentSection === 'ai assistant' },
    { icon: <User size={24} />, label: 'Account', active: currentSection === 'account' }
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'account':
        return <Account />;
      case 'inventory':
        return <Inventory />;
      case 'analytics':
        return <Analytics />;
      case 'overview':
        return (
          <div className="max-w-[1000px] mx-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Revenue', value: '$12,345', trend: '+15%' },
                { label: 'Active Products', value: '156', trend: '+3%' },
                { label: 'Waste Reduction', value: '25%', trend: '+8%' },
                { label: 'XEROW Balance', value: '1,234', trend: '+12%' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#666ED2]/30 transition-colors group"
                >
                  <h3 className="text-gray-500 font-raleway mb-2">{stat.label}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-syne text-[#2D2654]">{stat.value}</span>
                    <span className="text-green-500 text-sm">{stat.trend}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#666ED2] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Activity Feed */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-syne text-[#2D2654]">Recent Activity</h2>
                    <button className="text-gray-400 hover:text-[#666ED2]">
                      <MoreVertical size={24} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: <LineChart size={24} />, title: 'New Order', amount: '+$1,200', time: '2 minutes ago' },
                      { icon: <ClipboardList size={24} />, title: 'Inventory Update', amount: '-$450', time: '1 hour ago' },
                      { icon: <Plus size={24} />, title: 'New Product', amount: '+$890', time: '3 hours ago' },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F8F9FF] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-[#666ED2]/10 text-[#666ED2]">
                            {activity.icon}
                          </div>
                          <div>
                            <h3 className="font-syne text-[#2D2654]">{activity.title}</h3>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                        <span className={activity.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                          {activity.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-syne text-[#2D2654] mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Add New Product', icon: <Plus size={24} /> },
                    { label: 'Update Inventory', icon: <ClipboardList size={24} /> },
                    { label: 'View Analytics', icon: <BarChart3 size={24} /> },
                  ].map((action, index) => (
                    <motion.button
                      key={index}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F8F9FF] hover:bg-[#666ED2] hover:text-white text-[#2D2654] transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="p-2 rounded-lg bg-white text-[#666ED2] group-hover:bg-[#666ED2]/20 group-hover:text-white transition-colors">
                        {action.icon}
                      </div>
                      <span className="font-raleway">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl font-syne text-[#2D2654]">
              {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} Page Coming Soon
            </h2>
          </div>
        );
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
              <div className="relative">
                <Search size={24} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Here"
                  className="pl-10 pr-4 py-2 rounded-lg bg-[#F8F9FF] border border-gray-100 focus:border-[#666ED2] transition-colors"
                />
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