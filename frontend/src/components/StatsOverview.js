import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Button,
  useColorModeValue,
  Text,
  Flex,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useAnimals } from '../context/AnimalsContext';

const StatsOverview = () => {
  const { animals } = useAnimals();
  const [stats, setStats] = useState({
    total: 0,
    waterRescue: 0,
    mountainRescue: 0,
    disasterRescue: 0,
  });

  const calculateStats = useCallback(() => {
    if (!animals || animals.length === 0) {
      return {
        total: 0,
        waterRescue: 0,
        mountainRescue: 0,
        disasterRescue: 0,
      };
    }

    const total = animals.length;
    const waterRescue = animals.filter(animal => animal.rescueType === 'Water').length;
    const mountainRescue = animals.filter(animal => animal.rescueType === 'Mountain').length;
    const disasterRescue = animals.filter(animal => animal.rescueType === 'Disaster').length;

    return {
      total,
      waterRescue,
      mountainRescue,
      disasterRescue,
    };
  }, [animals]);

  const generateRandomStats = () => {
    // Generate random but realistic data
    const total = Math.floor(Math.random() * (1000 - 500) + 500); // Between 500-1000
    const waterRescue = Math.floor(total * (Math.random() * (0.4 - 0.2) + 0.2)); // 20-40% of total
    const mountainRescue = Math.floor(total * (Math.random() * (0.35 - 0.15) + 0.15)); // 15-35% of total
    const disasterRescue = Math.floor(total * (Math.random() * (0.3 - 0.1) + 0.1)); // 10-30% of total

    setStats({
      total,
      waterRescue,
      mountainRescue,
      disasterRescue,
    });
  };

  useEffect(() => {
    setStats(calculateStats());
  }, [calculateStats]);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const StatCard = ({ title, value, total, color }) => {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    const isPositive = value > 0;

    return (
      <Box
        p={5}
        bg={cardBg}
        rounded="xl"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="sm"
        transition="all 0.2s"
        _hover={{ shadow: 'md' }}
      >
        <StatGroup>
          <Stat>
            <StatLabel fontSize="lg" fontWeight="medium">
              {title}
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">
              {value.toLocaleString()}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={isPositive ? 'increase' : 'decrease'} />
              {percentage}% of total
            </StatHelpText>
          </Stat>
        </StatGroup>
      </Box>
    );
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Analytics Overview
        </Text>
        <Button
          leftIcon={<RepeatIcon />}
          onClick={generateRandomStats}
          size="sm"
          colorScheme="blue"
          variant="outline"
        >
          Refresh Data
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <Box
          p={5}
          bg={cardBg}
          rounded="xl"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
          transition="all 0.2s"
          _hover={{ shadow: 'md' }}
        >
          <StatGroup>
            <Stat>
              <StatLabel fontSize="lg" fontWeight="medium">
                Total Animals
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold">
                {stats.total.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                Current results
              </StatHelpText>
            </Stat>
          </StatGroup>
        </Box>

        <StatCard
          title="Water Rescue"
          value={stats.waterRescue}
          total={stats.total}
          color="blue"
        />
        <StatCard
          title="Mountain Rescue"
          value={stats.mountainRescue}
          total={stats.total}
          color="green"
        />
        <StatCard
          title="Disaster Rescue"
          value={stats.disasterRescue}
          total={stats.total}
          color="red"
        />
      </SimpleGrid>
    </Box>
  );
};

export default StatsOverview;