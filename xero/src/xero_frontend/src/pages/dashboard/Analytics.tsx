import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  AlertTriangle,
  Calendar,
  Package,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Boxes,
  Edit,
  Save
} from 'lucide-react';

// First, update the sample data structure to match the CSV template
interface InventoryItem {
  item_id: string;
  barcode: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiry_date: string;
}

// Update the sample data to match exactly what's in the CSV
const SAMPLE_DATA: InventoryItem[] = [
  {
    item_id: 'ITEM_001',
    barcode: 'FRSHMILK',
    name: 'Fresh Milk',
    category: 'Dairy',
    quantity: 100,
    price: 3.99,
    expiry_date: '#######'
  },
  {
    item_id: 'ITEM_002',
    barcode: 'WHTBREA',
    name: 'White Bread',
    category: 'Bakery',
    quantity: 50,
    price: 2.49,
    expiry_date: '#######'
  },
  {
    item_id: 'ITEM_003',
    barcode: 'CHKBRSTO',
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 30,
    price: 8.99,
    expiry_date: '#######'
  },
  {
    item_id: 'ITEM_004',
    barcode: 'TOMATOE',
    name: 'Tomatoes',
    category: 'Produce',
    quantity: 45,
    price: 0.49,
    expiry_date: '3/8/2024'
  },
  {
    item_id: 'ITEM_005',
    barcode: 'EGGS0000',
    name: 'Eggs',
    category: 'Dairy',
    quantity: 200,
    price: 3.99,
    expiry_date: '#######'
  }
];

export const Analytics: React.FC = () => {
  const [data, setData] = useState<typeof SAMPLE_DATA>([]);
  const [processing, setProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});

  const calculateMetrics = () => {
    if (data.length === 0) {
      return {
        totalItems: 0,
        lowStockItems: 0,
        overstockedItems: 0,
        expiringItems: 0,
        potentialLoss: 0,
        stockEfficiency: '0.0'
      };
    }

    const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = data.filter(item => item.quantity < 50);
    const overstockedItems = data.filter(item => item.quantity > 150);
    const expiringItems = data.filter(item => {
      return item.expiry_date !== '#######' && new Date(item.expiry_date) < new Date();
    });

    return {
      totalItems,
      lowStockItems: lowStockItems.length,
      overstockedItems: overstockedItems.length,
      expiringItems: expiringItems.length,
      potentialLoss: expiringItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      stockEfficiency: ((data.length - lowStockItems.length - overstockedItems.length) / data.length * 100).toFixed(1)
    };
  };

  const handleSync = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(SAMPLE_DATA);
    setProcessing(false);
  };

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
    setEditedValues(data.find(item => item.item_id === itemId) || {});
  };

  const handleSave = (itemId: string) => {
    setData(prev => prev.map(item => 
      item.item_id === itemId 
        ? { ...item, ...editedValues }
        : item
    ));
    setEditingItem(null);
    setEditedValues({});
  };

  const metrics = calculateMetrics();

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-syne text-[#2D2654]">Inventory Analytics</h1>
        <button
          onClick={handleSync}
          disabled={processing}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            processing 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#666ED2] text-white hover:bg-[#666ED2]/90'
          }`}
          title={processing ? 'Processing...' : 'Update Analytics'}
        >
          <RefreshCw size={20} className={processing ? 'animate-spin' : ''} />
          <span>{processing ? 'Processing...' : 'Update Analytics'}</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { 
            label: 'Stock Efficiency',
            value: `${metrics.stockEfficiency}%`,
            icon: <BarChart2 />,
            description: 'Items at optimal levels'
          },
          { 
            label: 'Low Stock Alert',
            value: metrics.lowStockItems,
            icon: <TrendingDown />,
            description: 'Items below threshold'
          },
          { 
            label: 'Overstock Alert',
            value: metrics.overstockedItems,
            icon: <TrendingUp />,
            description: 'Items above optimal'
          },
          { 
            label: 'Expiring Soon',
            value: metrics.expiringItems,
            icon: <Calendar />,
            description: 'Items expiring in 7 days'
          },
          { 
            label: 'Potential Loss',
            value: `$${metrics.potentialLoss.toFixed(2)}`,
            icon: <AlertTriangle />,
            description: 'Value of expiring items'
          },
          { 
            label: 'Total Inventory',
            value: metrics.totalItems,
            icon: <Boxes />,
            description: 'Total items in stock'
          }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-raleway">{metric.label}</p>
              <div className="p-3 rounded-xl bg-[#666ED2]/10 text-[#666ED2]">
                {metric.icon}
              </div>
            </div>
            <p className="text-2xl font-syne text-[#2D2654] mb-1">{metric.value}</p>
            <p className="text-sm text-gray-500">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Inventory Table */}
      {data.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-syne text-[#2D2654] mb-4">Inventory Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 text-left">Item</th>
                  <th className="p-4 text-left">Current Stock</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Expiry Date</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.item_id} className="border-b border-gray-100">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">${item.price.toFixed(2)}</td>
                    <td className="p-4">{item.expiry_date}</td>
                    <td className="p-4">
                      {editingItem === item.item_id ? (
                        <button
                          onClick={() => handleSave(item.item_id)}
                          className="p-2 text-green-600 hover:text-green-800"
                          title="Save changes"
                          aria-label="Save changes"
                        >
                          <Save size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(item.item_id)}
                          className="p-2 text-[#666ED2] hover:text-[#4F55A9]"
                          title="Edit item"
                          aria-label="Edit item"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 