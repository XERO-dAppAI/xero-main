import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet,
  Package,
  Upload,
  AlertTriangle,
  Calendar,
  BarChart2,
  Search
} from 'lucide-react';
import { downloadSampleCSV } from '../../utils/sampleInventory';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  expiryDate: string;
  category: string;
  status: string;
}

export const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    expiringSoon: 0,
    categories: 0
  });

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInventory(inventory);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = inventory.filter(item => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.expiryDate.toLowerCase().includes(query) ||
        item.price.toString().includes(query) ||
        item.quantity.toString().includes(query)
      );
    });

    setFilteredInventory(filtered);

    const categories = new Set(filtered.map(item => item.category)).size;
    const lowStock = filtered.filter(item => item.status === 'Low Stock').length;
    const expiring = filtered.filter(item => item.status === 'Expiring Soon').length;
    
    setStats({
      totalItems: filtered.length,
      lowStockItems: lowStock,
      expiringSoon: expiring,
      categories: categories
    });
  }, [searchQuery, inventory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csvData = event.target?.result as string;
          const lines = csvData.split('\n');
          const headers = lines[0].split(',').map(header => header.trim());
          
          const items = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',');
              const item: any = {};
              headers.forEach((header, index) => {
                item[header] = values[index]?.trim();
              });
              return {
                id: item.SKU || Math.random().toString(),
                name: item['Item Name'],
                category: item.Category,
                quantity: parseInt(item.Quantity),
                price: parseFloat(item.Price),
                expiryDate: item['Expiry Date'],
                status: determineStatus(
                  parseInt(item.Quantity),
                  parseInt(item['Minimum Stock Level']),
                  item['Expiry Date']
                )
              };
            });

          // Update inventory and stats
          setInventory(items);
          const categories = new Set(items.map(item => item.category)).size;
          const lowStock = items.filter(item => item.status === 'Low Stock').length;
          const expiring = items.filter(item => item.status === 'Expiring Soon').length;
          
          setStats({
            totalItems: items.length,
            lowStockItems: lowStock,
            expiringSoon: expiring,
            categories: categories
          });

        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format and try again.');
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsText(file);
    }
  };

  const determineStatus = (quantity: number, minStock: number, expiryDate: string) => {
    const expiryTimestamp = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const daysUntilExpiry = (expiryTimestamp - now) / (1000 * 60 * 60 * 24);

    if (daysUntilExpiry <= 0) return 'Expired';
    if (daysUntilExpiry <= 7) return 'Expiring Soon';
    if (quantity <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-500 bg-green-50';
      case 'Low Stock': return 'text-orange-500 bg-orange-50';
      case 'Expired': return 'text-red-500 bg-red-50';
      case 'Expiring Soon': return 'text-yellow-500 bg-yellow-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-syne text-[#2D2654]">Inventory Management</h1>
        <div className="flex gap-4">
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileSpreadsheet size={20} />
            Download Sample CSV
          </button>
          <label className={`flex items-center gap-2 px-4 py-2 bg-[#666ED2] text-white rounded-lg hover:bg-[#666ED2]/90 transition-colors cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
            <Upload size={20} />
            <span>{isUploading ? 'Uploading...' : 'Upload CSV'}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Stats Cards - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Items', value: stats.totalItems, icon: <Package /> },
          { label: 'Low Stock Items', value: stats.lowStockItems, icon: <AlertTriangle /> },
          { label: 'Expiring Soon', value: stats.expiringSoon, icon: <Calendar /> },
          { label: 'Categories', value: stats.categories, icon: <BarChart2 /> },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-raleway mb-2">{stat.label}</p>
                <p className="text-2xl font-syne text-[#2D2654]">{stat.value}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#666ED2]/10 text-[#666ED2]">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar - Always visible */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, status, date, price, or quantity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#666ED2] outline-none"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500">
            Found {filteredInventory.length} items
          </div>
        )}
      </div>

      {/* Empty State */}
      {inventory.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-[#666ED2]/10">
              <Package size={40} className="text-[#666ED2]" />
            </div>
          </div>
          <h2 className="text-xl font-syne text-[#2D2654] mb-2">No Inventory Items</h2>
          <p className="text-gray-500 mb-2">Upload your inventory using the sample CSV template</p>
          <p className="text-sm text-gray-400 mb-6">
            Using our template ensures proper formatting with all required fields: Item Name, Category, 
            Quantity, Price, Expiry Date, SKU, Supplier, Location, Minimum Stock Level, Maximum Stock Level, 
            Reorder Point, Unit of Measure, Brand, Description, and more.
          </p>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#666ED2] text-white rounded-lg hover:bg-[#666ED2]/90 transition-colors mx-auto"
          >
            <FileSpreadsheet size={20} />
            Download Sample CSV
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-syne text-[#2D2654]">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-syne text-[#2D2654]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-syne text-[#2D2654]">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-syne text-[#2D2654]">Price</th>
                <th className="px-6 py-4 text-left text-sm font-syne text-[#2D2654]">Expiry Date</th>
                <th className="px-6 py-4 text-left text-sm font-syne text-[#2D2654]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 font-raleway">{item.name}</td>
                  <td className="px-6 py-4 font-raleway">{item.category}</td>
                  <td className="px-6 py-4 font-raleway">{item.quantity}</td>
                  <td className="px-6 py-4 font-raleway">${item.price}</td>
                  <td className="px-6 py-4 font-raleway">{item.expiryDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 