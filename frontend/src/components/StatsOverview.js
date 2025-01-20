import React, { useMemo } from 'react';
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
  const { animals } = useAnimals();

  // Calculate statistics from filtered animals
  const statsData = useMemo(() => {
    if (!animals) return [];

    const totalCount = animals.length;
    
    // Count animals by rescue type
    const waterRescueCount = animals.filter(animal => 
      animal.rescueType === 'water'
    ).length;

    const mountainRescueCount = animals.filter(animal => 
      animal.rescueType === 'mountain'
    ).length;

    const disasterRescueCount = animals.filter(animal => 
      animal.rescueType === 'disaster'
    ).length;

    return [
      {
        title: 'Total Animals',
        stat: totalCount.toLocaleString(),
        icon: FaDog,
        helpText: 'Current results',
      },
      {
        title: 'Water Rescue',
        stat: waterRescueCount.toLocaleString(),
        icon: FaWater,
        helpText: `${((waterRescueCount / totalCount) * 100).toFixed(1)}% of total`,
      },
      {
        title: 'Mountain Rescue',
        stat: mountainRescueCount.toLocaleString(),
        icon: FaMountain,
        helpText: `${((mountainRescueCount / totalCount) * 100).toFixed(1)}% of total`,
      },
      {
        title: 'Disaster Rescue',
        stat: disasterRescueCount.toLocaleString(),
        icon: FaExclamationTriangle,
        helpText: `${((disasterRescueCount / totalCount) * 100).toFixed(1)}% of total`,
      },
    ];
  }, [animals]);

  // If there's no data, show zeros but maintain the layout
  if (!animals || animals.length === 0) {
    const emptyStats = [
      {
        title: 'Total Animals',
        stat: '0',
        icon: FaDog,
        helpText: 'No animals found',
      },
      {
        title: 'Water Rescue',
        stat: '0',
        icon: FaWater,
        helpText: 'No animals found',
      },
      {
        title: 'Mountain Rescue',
        stat: '0',
        icon: FaMountain,
        helpText: 'No animals found',
      },
      {
        title: 'Disaster Rescue',
        stat: '0',
        icon: FaExclamationTriangle,
        helpText: 'No animals found',
      },
    ];

    return (
      <Box py={8}>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={{ base: 5, lg: 8 }}
        >
          {emptyStats.map((stat, index) => (
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
  }

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