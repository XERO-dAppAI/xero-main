import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  Package,
  BarChart2,
  Tags,
  Wallet,
  Brain,
  Settings
} from 'lucide-react';
import logo from '../assets/logo.png';

const navLinks = [
  {
    label: 'Overview',
    path: '/dashboard',
    icon: LayoutGrid
  },
  {
    label: 'Inventory',
    path: '/dashboard/inventory',
    icon: Package
  },
  {
    label: 'Analytics',
    path: '/dashboard/analytics',
    icon: BarChart2
  },
  {
    label: 'Price Engine',
    path: '/dashboard/price-engine',
    icon: Tags
  },
  {
    label: 'Ledger',
    path: '/dashboard/ledger',
    icon: Wallet
  },
  {
    label: 'AI Assistant',
    path: '/dashboard/ai-assistant',
    icon: Brain
  },
  {
    label: 'Account',
    path: '/dashboard/account',
    icon: Settings,
    isActive: true
  }
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-72 h-screen bg-white/50 backdrop-blur-md border-r border-[#1a6363]/10 p-6 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <img src={logo} alt="XERO" className="w-10 h-10" />
        <span className="text-xl font-syne text-[#062424]">Dashboard</span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${link.path === '/dashboard/account' || location.pathname === link.path
                ? 'bg-[#1a6363] text-white shadow-lg shadow-[#1a6363]/20' 
                : 'text-[#062424]/60 hover:bg-[#1a6363]/10 hover:text-[#062424]'
              }`}
          >
            <link.icon className={`w-5 h-5 transition-colors duration-300 ${
              link.path === '/dashboard/account' || location.pathname === link.path
                ? 'text-white'
                : 'text-[#1a6363] group-hover:text-[#062424]'
            }`} />
            <span className="font-syne">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}; 