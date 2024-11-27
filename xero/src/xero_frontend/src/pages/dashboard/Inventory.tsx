import React, { useState, useEffect } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedData = localStorage.getItem('inventory_data');
    console.log('Loading inventory data:', savedData); // Debug log
    if (savedData) {
      setInventoryData(JSON.parse(savedData));
    }
    return () => {
      if (inventoryData.length > 0) {
        localStorage.setItem('inventory_data', JSON.stringify(inventoryData));
      }
    };
  }, []);

  useEffect(() => {
    if (mounted && inventoryData.length > 0) {
      console.log('Saving inventory data:', inventoryData); // Debug log
      localStorage.setItem('inventory_data', JSON.stringify(inventoryData));
    }
  }, [inventoryData, mounted]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim());
      const headers = rows[0].split(',').map(h => h.trim());
      
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        const item: InventoryItem = {
          item_id: crypto.randomUUID(),
          name: values[headers.indexOf('name')]?.trim() || '',
          category: values[headers.indexOf('category')]?.trim() || '',
          quantity: Number(values[headers.indexOf('quantity')]) || 0,
          price: Number(values[headers.indexOf('price')]) || 0,
          expiry_date: values[headers.indexOf('expiry_date')]?.trim() || '',
          status: values[headers.indexOf('status')]?.trim() || 'In Stock',
          barcode: crypto.randomUUID()
        };
        return item;
      });

      // Save to localStorage
      localStorage.setItem('inventory_data', JSON.stringify(data));
      setInventoryData(data);

      // Create ledger entry for upload
      const ledgerEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        actor: 'Admin',
        action_type: 'InventoryUpdate',
        details: {
          item_id: 'bulk',
          item_name: 'All Items',
          description: `Uploaded inventory data with ${data.length} items`
        }
      };
      localStorage.setItem('latest_ledger_entry', JSON.stringify(ledgerEntry));
      
      // Show success message
      alert(`Successfully uploaded ${data.length} items to inventory`);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the format and try again.');
    } finally {
      setLoading(false);
      if (event.target) {
        event.target.value = ''; // Reset file input
      }
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      'name,category,quantity,price,expiry_date,status',
      'Fresh Milk,Dairy,50,3.99,2024-12-31,In Stock',
      'White Bread,Bakery,30,2.49,2024-12-31,In Stock',
      'Chicken Breast,Meat,20,8.99,2024-12-31,Low Stock',
      'Tomatoes,Produce,100,0.49,2024-12-31,In Stock',
      'Eggs,Dairy,40,3.99,2024-12-31,In Stock',
      'Yogurt,Dairy,25,2.99,2024-12-31,Low Stock'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
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
            className="px-4 py-2 bg-[#666ED2]/10 text-[#666ED2] rounded-lg flex items-center gap-2"
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
            className="px-4 py-2 bg-[#666ED2] text-white rounded-lg cursor-pointer flex items-center gap-2"
          >
            <Upload size={20} />
            <span>Upload CSV</span>
          </label>
        </div>
      </div>

      {inventoryData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-syne text-lg mb-2">No inventory data</p>
          <p className="text-gray-400 text-sm mb-6">
            Download our sample CSV template and upload your inventory data to get started
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDownloadSample}
              className="px-6 py-3 bg-[#666ED2]/10 text-[#666ED2] rounded-lg flex items-center gap-2"
            >
              <Download size={20} />
              <span>Download Template</span>
            </button>
            <label
              htmlFor="csv-upload"
              className="px-6 py-3 bg-[#666ED2] text-white rounded-lg cursor-pointer flex items-center gap-2"
            >
              <Upload size={20} />
              <span>Upload CSV</span>
            </label>
          </div>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, category, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:outline-none focus:border-[#666ED2]"
            />
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-syne text-[#2D2654]">Product</th>
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
                    key={item.item_id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100"
                  >
                    <td className="p-4">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="p-4 text-gray-600">{item.category}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">${Number(item.price).toFixed(2)}</td>
                    <td className="p-4">{item.expiry_date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        item.status === 'In Stock' ? 'bg-green-100 text-green-600' :
                        item.status === 'Low Stock' ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}; 