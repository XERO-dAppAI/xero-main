import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Spacer, 
  Button, 
  IconButton, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { MdSettings, MdNotifications, MdSync } from 'react-icons/md';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/':
        return 'Dashboard';
      case '/inventory':
        return 'Inventory Management';
      case '/pricing':
        return 'Pricing Engine';
      case '/data-aggregator':
        return 'Data Aggregator';
      case '/ledger':
        return 'Blockchain Ledger';
      case '/testing':
        return 'Testing Tools';
      default:
        return 'XERO Platform';
    }
  };

  return (
    <Box bg="white" px={4} py={2} shadow="sm">
      <Flex alignItems="center">
        <Heading size="md">{getPageTitle()}</Heading>
        <Spacer />
        
        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<MdSync />}
          mr={2}
        >
          Sync Status
          <Badge ml={2} colorScheme="green">Live</Badge>
        </Button>

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MdNotifications />}
            variant="ghost"
            mr={2}
            aria-label="Notifications"
          />
          <MenuList>
            <MenuItem>No new notifications</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MdSettings />}
            variant="ghost"
            aria-label="Settings"
          />
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Help</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Navbar; 