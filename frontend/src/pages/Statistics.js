import React, { useEffect } from 'react';
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
  const { stats, loading, error, refreshData } = useAnimals();
  const chartBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Only fetch stats if they're not already loaded
    if (!stats) {
      refreshData();
    }
  }, [refreshData, stats]);

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

    if (!stats?.overview || !stats?.breedStats) {
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
            No Statistics Available
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    const { overview, breedStats } = stats;

    // Calculate percentages
    const dogPercentage = ((overview.dogCount || 0) / (overview.totalAnimals || 1) * 100).toFixed(1);
    const catPercentage = ((overview.catCount || 0) / (overview.totalAnimals || 1) * 100).toFixed(1);
    const otherCount = (overview.totalAnimals || 0) - ((overview.dogCount || 0) + (overview.catCount || 0));

    // Transform breed stats for the chart
    const chartData = Object.entries(breedStats)
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
            helpText="Current shelter population"
          />
          <StatCard
            label="Dogs"
            value={overview.dogCount.toLocaleString()}
            helpText={`${dogPercentage}% of total`}
          />
          <StatCard
            label="Cats"
            value={overview.catCount.toLocaleString()}
            helpText={`${catPercentage}% of total`}
          />
          <StatCard
            label="Other Animals"
            value={otherCount.toLocaleString()}
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
          <Heading size="md" mb={6}>Top 10 Breeds</Heading>
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
            helpText="Average age of animals"
          />
          <StatCard
            label="Adoptions This Month"
            value={overview.adoptionsThisMonth.toLocaleString()}
            helpText="Successfully placed"
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