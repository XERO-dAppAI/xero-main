import React, { ReactNode } from 'react';
import { Box, VStack, Icon, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';
import { 
  MdDashboard, 
  MdInventory, 
  MdAttachMoney, 
  MdSync, 
  MdAccountBalanceWallet,
  MdBugReport 
} from 'react-icons/md';

interface SidebarItemProps {
  to: string;
  icon: IconType;
  children: ReactNode;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, children, isActive }) => (
  <Link
    as={RouterLink}
    to={to}
    w="full"
    p={3}
    borderRadius="md"
    bg={isActive ? 'blue.100' : 'transparent'}
    _hover={{ bg: 'blue.50' }}
    display="flex"
    alignItems="center"
  >
    <Icon as={icon} mr={2} />
    <Text>{children}</Text>
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Box
      w="240px"
      h="100vh"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      py={4}
    >
      <VStack spacing={1} align="stretch" px={2}>
        <SidebarItem 
          to="/" 
          icon={MdDashboard}
          isActive={location.pathname === '/'}
        >
          Dashboard
        </SidebarItem>
        <SidebarItem 
          to="/inventory" 
          icon={MdInventory}
          isActive={location.pathname === '/inventory'}
        >
          Inventory
        </SidebarItem>
        <SidebarItem 
          to="/pricing" 
          icon={MdAttachMoney}
          isActive={location.pathname === '/pricing'}
        >
          Pricing Engine
        </SidebarItem>
        <SidebarItem 
          to="/data-aggregator" 
          icon={MdSync}
          isActive={location.pathname === '/data-aggregator'}
        >
          Data Aggregator
        </SidebarItem>
        <SidebarItem 
          to="/ledger" 
          icon={MdAccountBalanceWallet}
          isActive={location.pathname === '/ledger'}
        >
          Ledger
        </SidebarItem>
        <SidebarItem 
          to="/testing" 
          icon={MdBugReport}
          isActive={location.pathname === '/testing'}
        >
          Testing Tools
        </SidebarItem>
      </VStack>
    </Box>
  );
};

export default Sidebar; 