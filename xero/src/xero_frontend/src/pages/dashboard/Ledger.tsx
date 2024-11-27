import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Clock,
  User,
  ArrowRight,
  Tags,
  Package,
  DollarSign,
  Search,
  AlertCircle
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  timestamp: string;
  actor: string;
  principal_id?: string;
  action_type: 'PriceChange' | 'Transaction' | 'InventoryUpdate' | 'BulkPriceChange' | 'PriceRuleUpdate';
  details: {
    item_id?: string;
    item_name?: string;
    old_value?: number;
    new_value?: number;
    description: string;
    timestamp_ms?: number;
    items_affected?: number;
    old_rules?: string;
    new_rules?: string;
  };
}

export const Ledger: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshMessage, setRefreshMessage] = useState<string>('');

  // Load initial entries and set up storage listener
  useEffect(() => {
    loadLedgerEntries();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      loadLedgerEntries();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadLedgerEntries = () => {
    const previousEntries = entries.length;
    let newEntries: LedgerEntry[] = [];

    // Load existing ledger
    const savedEntries = localStorage.getItem('blockchain_ledger');
    if (savedEntries) {
      newEntries = JSON.parse(savedEntries);
    }

    // Check for new entry
    const latestEntry = localStorage.getItem('latest_ledger_entry');
    if (latestEntry) {
      const parsedEntry = JSON.parse(latestEntry);
      newEntries = [parsedEntry, ...newEntries];
      
      // Update blockchain ledger with new entry
      localStorage.setItem('blockchain_ledger', JSON.stringify(newEntries));
      localStorage.removeItem('latest_ledger_entry');
    }

    setEntries(newEntries);
    setLastRefresh(new Date());

    // Show refresh message
    if (newEntries.length === previousEntries) {
      setRefreshMessage('No new changes found');
    } else {
      const newChanges = newEntries.length - previousEntries;
      setRefreshMessage(`Found ${newChanges} new ${newChanges === 1 ? 'change' : 'changes'}`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setRefreshMessage(''), 3000);
  };

  // Filter entries based on search
  const filteredEntries = entries.filter(entry => {
    const searchLower = searchQuery.toLowerCase();
    return (
      entry.principal_id?.toLowerCase().includes(searchLower) ||
      entry.details.description.toLowerCase().includes(searchLower) ||
      entry.details.item_name?.toLowerCase().includes(searchLower) ||
      entry.action_type.toLowerCase().includes(searchLower)
    );
  });

  const formatTimestamp = (timestamp: string, timestamp_ms?: number) => {
    const date = timestamp_ms ? new Date(timestamp_ms) : new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIcon = (action_type: string) => {
    switch (action_type) {
      case 'PriceChange':
      case 'BulkPriceChange':
        return <Tags className="text-blue-500" />;
      case 'Transaction':
        return <DollarSign className="text-green-500" />;
      case 'InventoryUpdate':
        return <Package className="text-purple-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-syne text-[#2D2654]">Blockchain Ledger</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              {refreshMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`absolute right-0 -top-8 text-sm ${
                    refreshMessage.includes('No new') ? 'text-gray-500' : 'text-green-500'
                  }`}
                >
                  {refreshMessage}
                </motion.div>
              )}
              <button
                onClick={loadLedgerEntries}
                className="px-4 py-2 bg-[#666ED2]/10 text-[#666ED2] rounded-lg flex items-center gap-2"
                title="Refresh ledger"
              >
                <RefreshCw size={20} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by description, action type, or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#666ED2] focus:ring-0"
          />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          {searchQuery ? (
            <>
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <p className="text-gray-400 text-sm mt-2">
                Try searching with different terms or clear the search
              </p>
            </>
          ) : (
            <>
              <Clock className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No changes have been recorded yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Changes to inventory, prices, or transactions will appear here in real-time.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  {getActionIcon(entry.action_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-syne text-[#2D2654]">
                      {entry.action_type === 'PriceChange' ? 'Price Update' :
                       entry.action_type === 'BulkPriceChange' ? `Bulk Price Update (${entry.details.items_affected} items)` :
                       entry.action_type === 'PriceRuleUpdate' ? 'Price Rules Update' :
                       entry.action_type === 'Transaction' ? 'New Transaction' :
                       'Inventory Change'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(entry.timestamp, entry.details.timestamp_ms)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{entry.details.description}</p>
                  {entry.action_type === 'PriceRuleUpdate' && entry.details.old_rules && (
                    <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded mt-2">
                      <p>Previous Rules: {JSON.parse(entry.details.old_rules).maxDiscount}% max discount</p>
                      <p>New Rules: {JSON.parse(entry.details.new_rules).maxDiscount}% max discount</p>
                    </div>
                  )}
                  {entry.details.old_value !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 line-through">
                        ${entry.details.old_value.toFixed(2)}
                      </span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span className="text-green-600">
                        ${entry.details.new_value?.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} />
                    <span>Modified by: {entry.actor}</span>
                    {entry.principal_id && (
                      <span className="text-xs text-gray-400 ml-2">
                        (Principal: {entry.principal_id.slice(0, 6)}...{entry.principal_id.slice(-4)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {entries.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Last refreshed: {lastRefresh.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}; 