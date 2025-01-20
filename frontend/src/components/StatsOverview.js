import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaDog, FaWater, FaMountain, FaExclamationTriangle } from 'react-icons/fa';
import { useAnimals } from '../context/AnimalsContext';

const MotionBox = motion(Box);

const StatCard = ({ title, stat, icon, helpText }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      px={4}
      py={5}
      bg={bg}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="xl"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">
            {title}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="medium">
            {stat}
          </StatNumber>
          {helpText && (
            <Stat>
              <StatHelpText mb={0} color="gray.500">
                {helpText}
              </StatHelpText>
            </Stat>
          )}
        </Box>
        <Box
          p={3}
          bg={useColorModeValue('blue.50', 'blue.900')}
          borderRadius="xl"
        >
          <Icon as={icon} w={6} h={6} color="blue.500" />
        </Box>
      </Flex>
    </Box>
  );
};

const StatsOverview = () => {
  const { stats } = useAnimals();
  const overview = stats?.overview || {};

  const statsData = [
    {
      title: 'Total Animals',
      stat: overview.totalAnimals || 0,
      icon: FaDog,
      helpText: 'In our database',
    },
    {
      title: 'Water Rescue',
      stat: overview.waterRescue || 0,
      icon: FaWater,
      helpText: 'Potential candidates',
    },
    {
      title: 'Mountain Rescue',
      stat: overview.mountainRescue || 0,
      icon: FaMountain,
      helpText: 'Available for training',
    },
    {
      title: 'Disaster Rescue',
      stat: overview.disasterRescue || 0,
      icon: FaExclamationTriangle,
      helpText: 'Ready for deployment',
    },
  ];

  return (
    <Box py={8}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={{ base: 5, lg: 8 }}
      >
        {statsData.map((stat, index) => (
          <MotionBox
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Stat>
              <StatCard {...stat} />
            </Stat>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StatsOverview;
