import React, { useMemo } from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Progress,
  Heading,
  Button,
  SimpleGrid,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaDog,
  FaCat,
  FaDownload,
  FaSync,
} from 'react-icons/fa';
import { useAnimals } from '../context/AnimalsContext';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';

const MotionBox = motion(Box);

const StatCard = ({ icon, label, value, color }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      bg={bg}
      p={4}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="lg"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
    >
      <VStack spacing={2} align="start">
        <Icon as={icon} boxSize={6} color={color} />
        <Text fontSize="sm" color="gray.500">
          {label}
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
      </VStack>
    </Box>
  );
};

const Dashboard = () => {
  const { animals, refreshData } = useAnimals();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => {
    if (!animals || animals.length === 0) return null;

    // Count animals by type
    const dogs = animals.filter(animal => animal.animal_type === 'Dog');
    const cats = animals.filter(animal => animal.animal_type === 'Cat');
    
    // Calculate breed distribution
    const breedCount = animals.reduce((acc, animal) => {
      const breed = animal.breed?.replace(' Mix', ''); // Remove 'Mix' suffix for cleaner display
      if (breed) {
        acc[breed] = (acc[breed] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate adoption/transfer rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentOutcomes = animals.filter(animal => {
      const outcomeDate = new Date(animal.datetime);
      return outcomeDate > thirtyDaysAgo && 
             (animal.outcome_type === 'Adoption' || animal.outcome_type === 'Transfer');
    }).length;

    const adoptionRate = Math.round((recentOutcomes / animals.length) * 100);

    // Calculate location distribution
    const locationCount = animals.reduce((acc, animal) => {
      if (animal.location_lat && animal.location_long) {
        const locationKey = `${animal.location_lat.toFixed(2)},${animal.location_long.toFixed(2)}`;
        acc[locationKey] = (acc[locationKey] || 0) + 1;
      }
      return acc;
    }, {});

    const locationStats = Object.entries(locationCount)
      .map(([name, count]) => ({
        name: `Location ${name}`,
        percentage: Math.round((count / animals.length) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5); // Show top 5 locations

    return {
      dogsAvailable: dogs.length,
      catsAvailable: cats.length,
      adoptionRate,
      breedStats: Object.entries(breedCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3), // Top 3 breeds
      locationStats
    };
  }, [animals]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExport = () => {
    if (!animals || animals.length === 0) return;

    // Create CSV data
    const csvData = animals.map(animal => ({
      animal_id: animal.animal_id,
      animal_type: animal.animal_type,
      breed: animal.breed,
      age: animal.age_upon_outcome,
      outcome: animal.outcome_type,
      datetime: new Date(animal.datetime).toLocaleDateString(),
      location: `${animal.location_lat},${animal.location_long}`
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csvData[0]).join(",") + "\n" +
      csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "animal_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      shadow="xl"
      height="fit-content"
    >
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Analytics Dashboard</Heading>
            <HStack>
              <Tooltip label="Refresh data">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FaSync />}
                  onClick={refreshData}
                >
                  Refresh
                </Button>
              </Tooltip>
              <Tooltip label="Export data">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FaDownload />}
                  onClick={handleExport}
                >
                  Export
                </Button>
              </Tooltip>
            </HStack>
          </HStack>

          <SimpleGrid columns={2} spacing={4}>
            <StatCard
              icon={FaDog}
              label="Dogs"
              value={stats?.dogsAvailable || 0}
              color="blue.500"
            />
            <StatCard
              icon={FaCat}
              label="Cats"
              value={stats?.catsAvailable || 0}
              color="purple.500"
            />
          </SimpleGrid>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium" color={textColor}>
              Top Breeds
            </Text>
            <Box height="200px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.breedStats || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {(stats?.breedStats || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium" color={textColor}>
              30-Day Outcome Rate
            </Text>
            <Progress
              value={stats?.adoptionRate || 0}
              size="sm"
              colorScheme="green"
              borderRadius="full"
              hasStripe
              isAnimated
            />
            <Text mt={1} fontSize="sm" color={textColor}>
              {stats?.adoptionRate || 0}% adoption/transfer rate in last 30 days
            </Text>
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium" color={textColor}>
              Location Distribution
            </Text>
            <VStack align="stretch" spacing={2}>
              {(stats?.locationStats || []).map(location => (
                <Box key={location.name}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">{location.name}</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {location.percentage}%
                    </Text>
                  </HStack>
                  <Progress 
                    value={location.percentage} 
                    size="xs" 
                    colorScheme="blue" 
                  />
                </Box>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default Dashboard;