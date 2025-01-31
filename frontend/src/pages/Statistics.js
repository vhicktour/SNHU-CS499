import React, { useMemo } from 'react';
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

/**
 * StatCard Component
 * A reusable card component for displaying statistical information
 * Features:
 * - Responsive design with consistent spacing
 * - Theme-aware styling (light/dark mode support)
 * - Optional help text for additional context
 * 
 * @param {Object} props
 * @param {string} props.label - The title of the statistic
 * @param {string|number} props.value - The main statistical value to display
 * @param {string} [props.helpText] - Optional explanatory text shown below the value
 */
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
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
    >
      <Stat>
        <StatLabel fontSize="lg" fontWeight="medium">{label}</StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold" my={2}>
          {value}
        </StatNumber>
        {helpText && <StatHelpText fontSize="sm">{helpText}</StatHelpText>}
      </Stat>
    </Box>
  );
};

/**
 * Statistics Component
 * Main component for displaying comprehensive animal shelter statistics
 * Features:
 * - Overview cards with key metrics
 * - Interactive breed distribution chart
 * - Recent activity metrics
 * - Responsive layout
 * - Loading and error states
 * - Dark mode support
 */
const Statistics = () => {
  // Theme-aware color values
  const { animals, loading, error } = useAnimals();
  const chartBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  /**
   * Calculate Statistics
   * Processes raw animal data to generate various statistics and metrics
   * Uses useMemo to cache calculations and prevent unnecessary recalculations
   * Returns null if no data is available
   * 
   * Calculated metrics include:
   * - Animal type distribution (dogs, cats, others)
   * - Average age
   * - Recent adoptions and arrivals (30-day window)
   * - Breed distribution
   */
  const stats = useMemo(() => {
    if (!animals?.length) return null;

    // Track the current date for time-based calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Initialize accumulators
    let totalAge = 0;
    const breedCounts = new Map();
    let dogCount = 0;
    let catCount = 0;
    let adoptionsThisMonth = 0;
    let newArrivals = 0;

    // Process each animal in a single pass for efficiency
    animals.forEach(animal => {
      // Update type counts
      if (animal.type === 'dog') dogCount++;
      else if (animal.type === 'cat') catCount++;

      // Update age calculations
      if (animal.age) totalAge += animal.age;

      // Update breed statistics
      const breed = animal.breed || 'Unknown';
      breedCounts.set(breed, (breedCounts.get(breed) || 0) + 1);

      // Check recent activity
      const adoptionDate = animal.adoptionDate ? new Date(animal.adoptionDate) : null;
      const arrivalDate = animal.arrivalDate ? new Date(animal.arrivalDate) : null;

      if (adoptionDate && adoptionDate > thirtyDaysAgo) adoptionsThisMonth++;
      if (arrivalDate && arrivalDate > thirtyDaysAgo) newArrivals++;
    });

    const totalAnimals = animals.length;
    
    return {
      overview: {
        totalAnimals,
        dogCount,
        catCount,
        otherCount: totalAnimals - (dogCount + catCount),
        averageAge: totalAge / totalAnimals,
        adoptionsThisMonth,
        newArrivals
      },
      // Convert Map to object for easier handling
      breedStats: Object.fromEntries(breedCounts)
    };
  }, [animals]);

  /**
   * Render Content
   * Handles different display states (loading, error, no data, data display)
   * Returns appropriate UI components based on current state
   */
  const renderContent = () => {
    // Handle loading state
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
        </Box>
      );
    }

    // Handle error state
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

    // Handle no data state
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

    // Calculate percentages for display
    const dogPercentage = ((overview.dogCount / overview.totalAnimals) * 100).toFixed(1);
    const catPercentage = ((overview.catCount / overview.totalAnimals) * 100).toFixed(1);

    // Prepare chart data - sort breeds by count and take top 10
    const chartData = Object.entries(stats.breedStats)
      .map(([breed, count]) => ({
        breed,
        count: Number(count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return (
      <>
        {/* Overview Statistics Grid */}
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

        {/* Breed Distribution Chart */}
        <Box
          bg={chartBg}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
          transition="all 0.2s"
          _hover={{ shadow: 'lg' }}
        >
          <Heading size="md" mb={6}>Top Breeds in Current Results</Heading>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                  dataKey="breed"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: textColor, fontSize: 12 }}
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: textColor }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartBg,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px'
                  }}
                  formatter={(value) => [value.toLocaleString(), "Count"]}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3182CE"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Additional Statistics Grid */}
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