import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NavLink = ({ children, to, isActive }) => {
  const linkBg = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <RouterLink to={to}>
      <Box
        px={4}
        py={2}
        rounded="md"
        display="flex"
        alignItems="center"
        gap={2}
        bg={isActive ? linkBg : 'transparent'}
        _hover={{
          textDecoration: 'none',
          bg: hoverBg,
        }}
        cursor="pointer"
      >
        {children}
      </Box>
    </RouterLink>
  );
};

export default NavLink;
