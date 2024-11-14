import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import InventoryManagement from './components/pages/InventoryManagement';
import PricingEngine from './components/pages/PricingEngine';
import DataAggregator from './components/pages/DataAggregator';
import LedgerView from './components/pages/LedgerView';
import TestingTools from './components/pages/TestingTools';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Box display="flex" minHeight="100vh">
          <Sidebar />
          <Box flex="1" display="flex" flexDirection="column">
            <Navbar />
            <Box p={4} flex="1" bg="gray.50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/pricing" element={<PricingEngine />} />
                <Route path="/data-aggregator" element={<DataAggregator />} />
                <Route path="/ledger" element={<LedgerView />} />
                <Route path="/testing" element={<TestingTools />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App; 