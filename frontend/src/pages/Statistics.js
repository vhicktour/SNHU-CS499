import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useAnimals } from '../context/AnimalsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const StatCard = ({ label, value, helpText }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Stat>
        <StatLabel fontSize="lg">{label}</StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold" my={2}>
          {value}
        </StatNumber>
        {helpText && <StatHelpText>{helpText}</StatHelpText>}
      </Stat>
    </Box>
  );
};

const Statistics = () => {
  const { animals, loading, error } = useAnimals();
  const chartBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Calculate statistics from filtered animals data
  const stats = useMemo(() => {
    if (!animals || animals.length === 0) return null;

    // Count animals by type
    const dogCount = animals.filter(animal => animal.type === 'dog').length;
    const catCount = animals.filter(animal => animal.type === 'cat').length;
    const totalAnimals = animals.length;
    const otherCount = totalAnimals - (dogCount + catCount);

    // Calculate average age
    const totalAge = animals.reduce((sum, animal) => sum + (animal.age || 0), 0);
    const averageAge = totalAge / totalAnimals;

    // Count adoptions and new arrivals in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const adoptionsThisMonth = animals.filter(animal => {
      const adoptionDate = animal.adoptionDate ? new Date(animal.adoptionDate) : null;
      return adoptionDate && adoptionDate > thirtyDaysAgo;
    }).length;

    const newArrivals = animals.filter(animal => {
      const arrivalDate = animal.arrivalDate ? new Date(animal.arrivalDate) : null;
      return arrivalDate && arrivalDate > thirtyDaysAgo;
    }).length;

    // Count breeds
    const breedCounts = animals.reduce((acc, animal) => {
      const breed = animal.breed || 'Unknown';
      acc[breed] = (acc[breed] || 0) + 1;
      return acc;
    }, {});

    return {
      overview: {
        totalAnimals,
        dogCount,
        catCount,
        otherCount,
        averageAge,
        adoptionsThisMonth,
        newArrivals
      },
      breedStats: breedCounts
    };
  }, [animals]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <Spinner size="xl" color="blue.500" />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Error Loading Statistics
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error}
          </AlertDescription>
        </Alert>
      );
    }

    if (!stats || !animals.length) {
      return (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No Animals Found
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Try adjusting your filters to see more results.
          </AlertDescription>
        </Alert>
      );
    }

    const { overview } = stats;

    // Calculate percentages
    const dogPercentage = ((overview.dogCount) / overview.totalAnimals * 100).toFixed(1);
    const catPercentage = ((overview.catCount) / overview.totalAnimals * 100).toFixed(1);

    // Transform breed stats for the chart
    const chartData = Object.entries(stats.breedStats)
      .map(([breed, count]) => ({
        breed,
        count: Number(count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Show top 10 breeds

    return (
      <>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={12}>
          <StatCard
            label="Total Animals"
            value={overview.totalAnimals.toLocaleString()}
            helpText="Current filtered results"
          />
          <StatCard
            label="Dogs"
            value={overview.dogCount.toLocaleString()}
            helpText={`${dogPercentage}% of filtered total`}
          />
          <StatCard
            label="Cats"
            value={overview.catCount.toLocaleString()}
            helpText={`${catPercentage}% of filtered total`}
          />
          <StatCard
            label="Other Animals"
            value={overview.otherCount.toLocaleString()}
            helpText="Including birds, rabbits, etc."
          />
        </SimpleGrid>

        <Box
          bg={chartBg}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
        >
          <Heading size="md" mb={6}>Top Breeds in Current Results</Heading>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="breed"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: textColor, fontSize: 12 }}
                />
                <YAxis tick={{ fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartBg,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                <Bar dataKey="count" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <StatCard
            label="Average Age"
            value={`${overview.averageAge.toFixed(1)} years`}
            helpText="Average age in current results"
          />
          <StatCard
            label="Recent Adoptions"
            value={overview.adoptionsThisMonth.toLocaleString()}
            helpText="Last 30 days"
          />
          <StatCard
            label="New Arrivals"
            value={overview.newArrivals.toLocaleString()}
            helpText="Last 30 days"
          />
        </SimpleGrid>
      </>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={8}>Animal Statistics</Heading>
      {renderContent()}
    </Container>
  );
};

export default Statistics;