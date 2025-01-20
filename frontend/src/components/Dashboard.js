import React from 'react';
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
  const { stats } = useAnimals();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Use stats data if available, otherwise fallback to default values
  const dogsAvailable = stats?.overview?.dogs || 124;
  const catsAvailable = stats?.overview?.cats || 89;
  const adoptionRate = stats?.overview?.adoptionRate || 75;

  // Transform breed stats into array format
  const breedData = stats?.breedStats ? 
    Object.entries(stats.breedStats)
      .map(([name, count]) => ({
        name,
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3) : 
    [
      { name: 'Labrador', value: 30 },
      { name: 'German Shepherd', value: 25 },
      { name: 'Golden Retriever', value: 20 },
    ];

  const locationData = stats?.locationStats || [
    { name: 'North Austin', percentage: 45 },
    { name: 'South Austin', percentage: 30 },
    { name: 'Central Austin', percentage: 25 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                  _hover={{
                    transform: 'rotate(180deg)',
                  }}
                  transition="all 0.3s"
                >
                  Refresh
                </Button>
              </Tooltip>
              <Tooltip label="Export data">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FaDownload />}
                >
                  Export
                </Button>
              </Tooltip>
            </HStack>
          </HStack>

          <SimpleGrid columns={2} spacing={4}>
            <StatCard
              icon={FaDog}
              label="Dogs Available"
              value={dogsAvailable}
              color="blue.500"
            />
            <StatCard
              icon={FaCat}
              label="Cats Available"
              value={catsAvailable}
              color="purple.500"
            />
          </SimpleGrid>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium" color={textColor}>
              Breed Distribution
            </Text>
            <Box height="200px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {breedData.map((entry, index) => (
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
              Adoption Rate
            </Text>
            <Progress
              value={adoptionRate}
              size="sm"
              colorScheme="green"
              borderRadius="full"
              hasStripe
              isAnimated
            />
            <Text mt={1} fontSize="sm" color={textColor}>
              {adoptionRate}% success rate this month
            </Text>
          </Box>

          <Box>
            <Text mb={2} fontSize="sm" fontWeight="medium" color={textColor}>
              Location Distribution
            </Text>
            <VStack align="stretch" spacing={2}>
              {locationData.map(location => (
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
