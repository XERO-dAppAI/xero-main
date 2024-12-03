import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tags, 
  TrendingDown, 
  Calendar,
  AlertTriangle,
  Save,
  RefreshCw,
  Settings,
  Edit,
  Edit2,
  X,
  Check,
  Upload,
  Package
} from 'lucide-react';

interface PriceItem {
  item_id: string;
  name: string;
  category: string;
  original_price: number;
  current_price: number;
  suggested_discount: number;
  days_until_expiry: number;
  status: string;
  expiry_date: string;
  quantity: number;
}

interface PriceRules {
  expiryThreshold: number;
  maxDiscount: number;
  quantityThreshold: number;
  discountStep: number;
  selectedCategory: string;
  applyToCategory: boolean;
}

interface EditableFields {
  current_price: number;
  suggested_discount: number;
}

export const PriceEngine: React.FC = () => {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [editingFields, setEditingFields] = useState<{[key: string]: EditableFields}>({});
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [priceRules, setPriceRules] = useState<PriceRules>({
    expiryThreshold: 30,
    maxDiscount: 75,
    quantityThreshold: 50,
    discountStep: 5,
    selectedCategory: 'all',
    applyToCategory: false
  });
  const [principalId, setPrincipalId] = useState<string>('');

  // Load saved data on mount
  useEffect(() => {
    // Load saved price rules
    const savedRules = localStorage.getItem('price_rules');
    if (savedRules) {
      setPriceRules(JSON.parse(savedRules));
    }

    // Load saved price engine data
    const savedItems = localStorage.getItem('price_engine_data');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save data whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('price_engine_data', JSON.stringify(items));
    }
  }, [items]);

  const syncInventory = () => {
    // Sample data to be loaded on sync
    const sampleData = [
      {
        item_id: crypto.randomUUID(),
        name: 'Fresh Milk',
        category: 'Dairy',
        original_price: 3.99,
        current_price: 3.99,
        suggested_discount: 0,
        days_until_expiry: -256,
        status: 'Expired',
        expiry_date: '2023-01-01',
        quantity: 100
      },
      {
        item_id: crypto.randomUUID(),
        name: 'White Bread',
        category: 'Bakery',
        original_price: 2.49,
        current_price: 2.49,
        suggested_discount: 0,
        days_until_expiry: -261,
        status: 'Expired',
        expiry_date: '2023-01-01',
        quantity: 100
      },
      {
        item_id: crypto.randomUUID(),
        name: 'Chicken Breast',
        category: 'Meat',
        original_price: 8.99,
        current_price: 8.99,
        suggested_discount: 0,
        days_until_expiry: -259,
        status: 'Expired',
        expiry_date: '2023-01-01',
        quantity: 100
      },
      {
        item_id: crypto.randomUUID(),
        name: 'Tomatoes',
        category: 'Produce',
        original_price: 0.49,
        current_price: 0.49,
        suggested_discount: 0,
        days_until_expiry: -263,
        status: 'Expired',
        expiry_date: '2023-01-01',
        quantity: 100
      },
      {
        item_id: crypto.randomUUID(),
        name: 'Eggs',
        category: 'Dairy',
        original_price: 3.99,
        current_price: 3.99,
        suggested_discount: 0,
        days_until_expiry: -251,
        status: 'Expired',
        expiry_date: '2023-01-01',
        quantity: 100
      },
      {
        item_id: crypto.randomUUID(),
        name: 'Yogurt',
        category: 'Dairy',
        original_price: 2.99,
        current_price: 2.99,
        suggested_discount: 0,
        days_until_expiry: -291,
        status: 'Expired',
        expiry_date: '2023-01-01',
        quantity: 100
      }
    ];

    // Set the items directly
    setItems(sampleData as PriceItem[]);

    // Create ledger entry
    const ledgerEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: principalId || 'Unknown User',
      action_type: 'BulkPriceChange',
      details: {
        item_id: 'bulk',
        item_name: 'All Items',
        description: `Synced ${sampleData.length} items`,
        items_affected: sampleData.length,
        timestamp_ms: Date.now()
      }
    };

    // Save to ledger
    const existingLedger = localStorage.getItem('blockchain_ledger') || '[]';
    const ledgerEntries = JSON.parse(existingLedger);
    ledgerEntries.unshift(ledgerEntry);
    localStorage.setItem('blockchain_ledger', JSON.stringify(ledgerEntries));
  };

  const calculateDiscount = (daysUntilExpiry: number, quantity: number, category: string): number => {
    if (priceRules.applyToCategory && priceRules.selectedCategory !== 'all' 
        && category !== priceRules.selectedCategory) {
      return 0;
    }

    if (daysUntilExpiry > priceRules.expiryThreshold) return 0;

    // Base discount calculation based on how close to expiry
    let baseDiscount = Math.round(
      ((priceRules.expiryThreshold - daysUntilExpiry) / priceRules.expiryThreshold) * 100
    );

    // Additional discount tiers based on days until expiry
    if (daysUntilExpiry <= 7) {
      baseDiscount += 30; // Critical expiry - add 30%
    } else if (daysUntilExpiry <= 14) {
      baseDiscount += 20; // Near expiry - add 20%
    } else if (daysUntilExpiry <= 21) {
      baseDiscount += 10; // Approaching expiry - add 10%
    }

    // Additional discount for high quantity items
    if (quantity > priceRules.quantityThreshold) {
      baseDiscount += priceRules.discountStep;
    }

    // Apply discount steps based on quantity tiers
    const quantityTiers = Math.floor(quantity / priceRules.quantityThreshold);
    baseDiscount += quantityTiers * (priceRules.discountStep / 2);

    // Ensure discount doesn't exceed maximum
    return Math.min(baseDiscount, priceRules.maxDiscount);
  };

  const handlePriceUpdate = (item: any, newPrice: number) => {
    // Create ledger entry with actual price data
    const ledgerEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: principalId || 'Unknown User',
      action_type: 'PriceChange',
      details: {
        item_id: item.item_id,
        item_name: item.name,
        old_value: item.current_price,
        new_value: newPrice,
        description: `Price updated for ${item.name} from $${item.current_price.toFixed(2)} to $${newPrice.toFixed(2)}`,
        timestamp_ms: Date.now()
      }
    };

    // Save to ledger
    const existingLedger = localStorage.getItem('blockchain_ledger') || '[]';
    const ledgerEntries = JSON.parse(existingLedger);
    ledgerEntries.unshift(ledgerEntry);
    localStorage.setItem('blockchain_ledger', JSON.stringify(ledgerEntries));

    // Update items state
    setItems(items.map(currentItem => 
      currentItem.item_id === item.item_id ? { ...currentItem, current_price: newPrice } : currentItem
    ));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSaveRules = () => {
    const oldRules = localStorage.getItem('price_rules');
    localStorage.setItem('price_rules', JSON.stringify(priceRules));

    // Apply the new rules to items based on category
    const updatedItems = items.map(item => {
      // Only apply rules to selected category if specified
      if (priceRules.applyToCategory && 
          priceRules.selectedCategory !== 'all' && 
          item.category !== priceRules.selectedCategory) {
        return item;
      }

      // Calculate new discount based on rules
      const suggestedDiscount = calculateDiscount(item.days_until_expiry, item.quantity, item.category);
      const discountedPrice = Number((item.original_price * (1 - suggestedDiscount / 100)).toFixed(2));

      return {
        ...item,
        current_price: discountedPrice,
        suggested_discount: suggestedDiscount
      };
    });

    // Create ledger entries
    const ruleUpdateEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: principalId || 'Unknown User',
      action_type: 'PriceRuleUpdate',
      details: {
        item_id: 'rules',
        item_name: 'Price Rules',
        description: `Updated price rules: Max ${priceRules.maxDiscount}% discount, ${
          priceRules.applyToCategory 
            ? `Applied to ${priceRules.selectedCategory} category` 
            : 'Applied to all categories'
        }`,
        old_rules: oldRules,
        new_rules: JSON.stringify(priceRules),
        timestamp_ms: Date.now()
      }
    };

    const bulkUpdateEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: principalId || 'Unknown User',
      action_type: 'BulkPriceChange',
      details: {
        item_id: 'bulk',
        item_name: 'All Items',
        description: `Applied new price rules to ${
          priceRules.applyToCategory 
            ? `${priceRules.selectedCategory} category` 
            : 'all items'
        }`,
        items_affected: updatedItems.length,
        timestamp_ms: Date.now()
      }
    };

    // Save to ledger
    const existingLedger = localStorage.getItem('blockchain_ledger') || '[]';
    const ledgerEntries = JSON.parse(existingLedger);
    ledgerEntries.unshift(ruleUpdateEntry, bulkUpdateEntry);
    localStorage.setItem('blockchain_ledger', JSON.stringify(ledgerEntries));

    // Update state and storage
    setItems(updatedItems);
    localStorage.setItem('price_engine_data', JSON.stringify(updatedItems));

    // Close settings modal
    setShowSettings(false);

    // Trigger ledger refresh
    window.dispatchEvent(new Event('storage'));
  };

  const startEditing = (item: PriceItem) => {
    setEditingFields({
      ...editingFields,
      [item.item_id]: {
        current_price: item.current_price,
        suggested_discount: item.suggested_discount
      }
    });
  };

  const cancelEditing = (itemId: string) => {
    const newEditingFields = { ...editingFields };
    delete newEditingFields[itemId];
    setEditingFields(newEditingFields);
  };

  const handleFieldChange = (itemId: string, field: keyof EditableFields, value: number) => {
    setEditingFields(prev => {
      const newFields = { ...prev };
      newFields[itemId] = {
        ...newFields[itemId],
        [field]: value
      };

      // If discount is changed, update current price
      if (field === 'suggested_discount') {
        const item = items.find(i => i.item_id === itemId);
        if (item) {
          const newPrice = Number((item.original_price * (1 - value / 100)).toFixed(2));
          newFields[itemId].current_price = newPrice;
        }
      }

      // If current price is changed, update discount
      if (field === 'current_price') {
        const item = items.find(i => i.item_id === itemId);
        if (item) {
          const newDiscount = Number((((item.original_price - value) / item.original_price) * 100).toFixed(0));
          newFields[itemId].suggested_discount = newDiscount;
        }
      }

      return newFields;
    });
  };

  const saveChanges = (itemId: string) => {
    const editedFields = editingFields[itemId];
    const item = items.find(i => i.item_id === itemId);
    
    if (!item || !editedFields) return;

    // Calculate the new price based on discount
    const newDiscount = editedFields.suggested_discount;
    const newPrice = Number((item.original_price * (1 - newDiscount / 100)).toFixed(2));

    // Create updated item with new values
    const updatedItem = {
      ...item,
      current_price: newPrice,
      suggested_discount: newDiscount
    };

    // Create ledger entry for the change
    const ledgerEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: principalId || 'Unknown User',
      action_type: 'PriceChange',
      details: {
        item_id: itemId,
        item_name: item.name,
        old_value: item.current_price,
        new_value: newPrice,
        description: `Manual price update for ${item.name} (${newDiscount}% discount applied)`,
        timestamp_ms: Date.now()
      }
    };

    // Save to ledger
    const existingLedger = localStorage.getItem('blockchain_ledger') || '[]';
    const ledgerEntries = JSON.parse(existingLedger);
    ledgerEntries.unshift(ledgerEntry);
    localStorage.setItem('blockchain_ledger', JSON.stringify(ledgerEntries));

    // Update items state
    setItems(items.map(i => i.item_id === itemId ? updatedItem : i));

    // Clear editing state
    const newEditingFields = { ...editingFields };
    delete newEditingFields[itemId];
    setEditingFields(newEditingFields);
  };

  const getUniqueCategories = () => {
    const categories = items.map(item => item.category);
    return ['all', ...new Set(categories)];
  };

  // Add cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Save current state when leaving the component
      if (items.length > 0) {
        localStorage.setItem('price_engine_data', JSON.stringify(items));
      }
    };
  }, [items]);

  // Update the refreshPrices function to only handle manual edits
  const refreshPrices = () => {
    const updatedItems = items.map(item => {
      // Only update items that have been manually edited
      if (editingFields[item.item_id]) {
        const editedFields = editingFields[item.item_id];
        const newDiscount = editedFields.suggested_discount;
        const newPrice = Number((item.original_price * (1 - newDiscount / 100)).toFixed(2));

        return {
          ...item,
          current_price: newPrice,
          suggested_discount: newDiscount
        };
      }
      return item;
    });

    setItems(updatedItems);

    // Clear all editing states
    setEditingFields({});

    // Create ledger entry for manual updates
    const ledgerEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: principalId || 'Unknown User',
      action_type: 'BulkPriceChange',
      details: {
        item_id: 'bulk',
        item_name: 'Manual Edits',
        description: `Applied manual price updates`,
        items_affected: Object.keys(editingFields).length,
        timestamp_ms: Date.now()
      }
    };

    // Save to ledger
    const existingLedger = localStorage.getItem('blockchain_ledger') || '[]';
    const ledgerEntries = JSON.parse(existingLedger);
    ledgerEntries.unshift(ledgerEntry);
    localStorage.setItem('blockchain_ledger', JSON.stringify(ledgerEntries));
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-syne text-[#2D2654]">Price Engine</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-[#666ED2]/10 text-[#666ED2] rounded-lg flex items-center gap-2"
          >
            <Settings size={20} />
            <span>Price Rules</span>
          </button>
          <button
            onClick={refreshPrices}
            className="px-4 py-2 bg-[#666ED2]/10 text-[#666ED2] rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Refresh Prices</span>
          </button>
          <button
            onClick={syncInventory}
            className="px-4 py-2 bg-[#666ED2] text-white rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Sync Inventory</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-syne text-lg mb-2">No items to display</p>
          <p className="text-gray-400 text-sm mb-6">
            Click "Sync Inventory" to load items and apply pricing rules
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 font-syne text-[#2D2654]">Product</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Original Price</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Current Price</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Suggested Discount</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Expiry Status</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-4">
                      <Package size={48} className="text-gray-300" />
                      <p>Click "Sync Inventory" to load items from inventory</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <motion.tr
                    key={item.item_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="p-4">${item.original_price.toFixed(2)}</td>
                    <td className="p-4">
                      {editingFields[item.item_id] ? (
                        <input
                          type="number"
                          value={editingFields[item.item_id].current_price}
                          onChange={(e) => handleFieldChange(item.item_id, 'current_price', Number(e.target.value))}
                          className="w-24 p-1 border rounded"
                          step="0.01"
                          min="0"
                          title="Current Price"
                          aria-label="Current Price"
                          placeholder="Enter price"
                        />
                      ) : (
                        `$${item.current_price.toFixed(2)}`
                      )}
                    </td>
                    <td className="p-4">
                      {editingFields[item.item_id] ? (
                        <input
                          type="number"
                          value={editingFields[item.item_id].suggested_discount}
                          onChange={(e) => handleFieldChange(item.item_id, 'suggested_discount', Number(e.target.value))}
                          className="w-20 p-1 border rounded"
                          step="1"
                          min="0"
                          max="100"
                          title="Suggested Discount"
                          aria-label="Suggested Discount"
                          placeholder="Enter discount"
                        />
                      ) : (
                        <span className="text-[#666ED2]">
                          {item.suggested_discount}% off
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          item.days_until_expiry <= 7 ? 'bg-red-100 text-red-600' : 
                          item.days_until_expiry <= 14 ? 'bg-orange-100 text-orange-600' : 
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {item.days_until_expiry} days left
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {editingFields[item.item_id] ? (
                          <>
                            <button
                              onClick={() => saveChanges(item.item_id)}
                              className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                              title="Save changes"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => cancelEditing(item.item_id)}
                              className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditing(item)}
                            className="p-2 text-[#666ED2] hover:text-[#4F55A9] rounded-full hover:bg-[#666ED2]/10"
                            title="Edit item"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-syne text-[#2D2654] mb-4">Price Rules Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Apply Rules To</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={priceRules.applyToCategory}
                      onChange={(e) => setPriceRules({
                        ...priceRules,
                        applyToCategory: e.target.checked,
                        selectedCategory: e.target.checked ? priceRules.selectedCategory : 'all'
                      })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Apply to specific category</span>
                  </label>
                </div>
                {priceRules.applyToCategory && (
                  <select
                    value={priceRules.selectedCategory}
                    onChange={(e) => setPriceRules({...priceRules, selectedCategory: e.target.value})}
                    className="w-full p-2 border rounded"
                    title="Select Category"
                    aria-label="Select Category"
                  >
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Expiry Threshold (days)</label>
                <input
                  type="number"
                  value={priceRules.expiryThreshold}
                  onChange={(e) => setPriceRules({...priceRules, expiryThreshold: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter days before expiry"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Maximum Discount (%)</label>
                <input
                  type="number"
                  value={priceRules.maxDiscount}
                  onChange={(e) => setPriceRules({...priceRules, maxDiscount: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter maximum discount percentage"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantity Threshold</label>
                <input
                  type="number"
                  value={priceRules.quantityThreshold}
                  onChange={(e) => setPriceRules({...priceRules, quantityThreshold: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter quantity threshold"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Discount Step (%)</label>
                <input
                  type="number"
                  value={priceRules.discountStep}
                  onChange={(e) => setPriceRules({...priceRules, discountStep: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter discount step percentage"
                />
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {priceRules.applyToCategory 
                    ? `Rules will only apply to ${priceRules.selectedCategory === 'all' 
                        ? 'all categories' 
                        : `the ${priceRules.selectedCategory} category`}`
                    : 'Rules will apply to all items'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('price_rules', JSON.stringify(priceRules));
                  syncInventory(); // Apply new rules immediately
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-[#666ED2] text-white rounded"
              >
                Save & Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}; 