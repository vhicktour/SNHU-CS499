import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavLink from './NavLink';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
  },
  {
    id: 'map',
    label: 'Map View',
    path: '/map',
  },
  {
    id: 'statistics',
    label: 'Statistics',
    path: '/statistics',
  },
];

export default function Header() {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.800')} 
      px={4} 
      position="fixed"
      top={0}
      left={0}
      right={0}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      zIndex="sticky"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="100%" mx="auto">
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
        />
        
        <HStack spacing={8} alignItems="center" flex={1}>
          <Box>
            <RouterLink to="/">
              <Box 
                fontSize="xl" 
                fontWeight="bold" 
                color={useColorModeValue('blue.500', 'blue.300')}
              >
                Animal Rescue
              </Box>
            </RouterLink>
          </Box>

          <HStack
            as="nav"
            spacing={4}
            display={{ base: 'none', md: 'flex' }}
          >
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                isActive={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </HStack>
        </HStack>

        <InputGroup maxW="400px" mx={8}>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search rescued animals..."
            variant="filled"
          />
        </InputGroup>

        <Flex alignItems="center" gap={4}>
          <IconButton
            size="md"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
            variant="ghost"
            color={useColorModeValue('gray.600', 'gray.300')}
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.700')
            }}
          />

          <Menu>
            <MenuButton
              as={IconButton}
              size="sm"
              icon={<FaUser />}
              aria-label="User menu"
            />
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Box pb={4} display={{ md: 'none' }}>
        <Stack as="nav" spacing={4}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              isActive={location.pathname === item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
