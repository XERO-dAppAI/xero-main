import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  BarChart2,
  Upload,
  Download,
  Search
} from 'lucide-react';

interface InventoryItem {
  item_id: string;
  barcode: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiry_date: string;
  status: string;
}

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  expiringSoon: number;
  categories: number;
}

export const Inventory: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStockItems: 0,
    expiringSoon: 0,
    categories: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const updateStats = (data: InventoryItem[]) => {
    const uniqueCategories = new Set(data.map(item => item.category));
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    setStats({
      totalItems: data.length,
      lowStockItems: data.filter(item => item.quantity < 20).length,
      expiringSoon: data.filter(item => {
        const expiryDate = new Date(item.expiry_date);
        return expiryDate <= thirtyDaysFromNow;
      }).length,
      categories: uniqueCategories.size
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const text = await file.text();
      const rows = text.split('\n');
      
      // Skip empty rows and trim whitespace
      const validRows = rows.filter(row => row.trim().length > 0);
      
      if (validRows.length < 2) { // Header + at least one data row
        throw new Error('CSV file is empty or invalid');
      }

      const headers = validRows[0].split(',').map(h => h.trim());
      const expectedHeaders = ['Item ID', 'Barcode', 'Name', 'Category', 'Quantity', 'Price', 'Expiration Date'];
      
      // Validate headers
      if (!expectedHeaders.every(header => headers.includes(header))) {
        throw new Error('CSV file does not match the expected format');
      }

      const parsedData = validRows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        return {
          item_id: values[0],
          barcode: values[1],
          name: values[2],
          category: values[3],
          quantity: parseInt(values[4]),
          price: parseFloat(values[5]),
          expiry_date: values[6],
          status: new Date(values[6]) < new Date() ? 'Expired' : 'Active'
        };
      }).filter(item => 
        item.name && 
        item.category && 
        !isNaN(item.quantity) && 
        !isNaN(item.price) && 
        isValidDate(item.expiry_date)
      );

      if (parsedData.length === 0) {
        throw new Error('No valid data found in CSV file');
      }

      // Save to localStorage
      localStorage.setItem('inventory_data', JSON.stringify(parsedData));

      // Update state
      setInventoryData(parsedData);
      updateStats(parsedData);

    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Helper function to validate date
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleDownloadSample = () => {
    const sampleData = `Item ID,Barcode,Name,Category,Quantity,Price,Expiration Date
ITEM_001,FRSHMILK01,Fresh Milk,Dairy,100,3.99,2024-03-15
ITEM_002,WHTBREAD01,White Bread,Bakery,50,2.49,2024-03-10
ITEM_003,CHKBRST01,Chicken Breast,Meat,30,8.99,2024-03-12
ITEM_004,TOMATOES01,Tomatoes,Produce,45,0.49,2024-03-08
ITEM_005,EGGS00001,Eggs,Dairy,200,3.99,2024-03-20`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_inventory.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredInventory = inventoryData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#666ED2]" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-syne text-[#2D2654]">Inventory Management</h1>
        <div className="flex gap-4">
          <button
            onClick={handleDownloadSample}
            className="px-4 py-2 bg-[#666ED2]/10 text-[#666ED2] rounded-lg flex items-center gap-2 hover:bg-[#666ED2]/20"
          >
            <Download size={20} />
            <span>Download Sample CSV</span>
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="px-4 py-2 bg-[#666ED2] text-white rounded-lg cursor-pointer flex items-center gap-2 hover:bg-[#666ED2]/90"
          >
            <Upload size={20} />
            <span>Upload CSV</span>
          </label>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, category, status, date, price, or quantity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:outline-none focus:border-[#666ED2]"
        />
      </div>

      {/* Inventory Table or Empty State */}
      {inventoryData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Package size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">No inventory items yet</p>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            Our template CSV has all the necessary fields for your inventory. 
            Download the sample CSV, fill it with your data, and upload it back here.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleDownloadSample}
              className="px-4 py-2 bg-[#666ED2]/10 text-[#666ED2] rounded-lg flex items-center gap-2 hover:bg-[#666ED2]/20"
            >
              <Download size={20} />
              <span>Download Sample CSV</span>
            </button>
            <label
              htmlFor="csv-upload"
              className="px-4 py-2 bg-[#666ED2] text-white rounded-lg cursor-pointer flex items-center gap-2 hover:bg-[#666ED2]/90"
            >
              <Upload size={20} />
              <span>Upload CSV</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 font-syne text-[#2D2654]">Item Name</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Category</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Quantity</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Price</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Expiry Date</th>
                <th className="text-left p-4 font-syne text-[#2D2654]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">${item.price.toFixed(2)}</td>
                  <td className="p-4">{item.expiry_date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'Expired' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
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