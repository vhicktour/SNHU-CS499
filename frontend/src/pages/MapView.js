import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Box, 
  Container, 
  Heading, 
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Button,
  Select,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { FaDog, FaCat, FaMapMarkerAlt } from 'react-icons/fa';
import { useAnimals } from '../context/AnimalsContext';

/**
 * MapController Component
 * A memoized controller component that handles map view updates based on selected locations
 * Uses react-leaflet's useMap hook to access the map instance
 * Animates map movements when center or zoom changes
 */
const MapController = React.memo(({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && map) {
      try {
        // Add slight delay to ensure smooth transitions
        const timer = setTimeout(() => {
          map.setView(center, zoom, {
            animate: true,
            duration: 1
          });
        }, 100);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error updating map view:', error);
      }
    }
  }, [map, center, zoom]);
  
  return null;
});

/**
 * Icon Cache and Generator
 * Caches custom markers to improve performance by avoiding recreating icons
 * Creates distinct icons for dogs and cats with different colors and count displays
 */
const iconCache = new Map();
const getCustomIcon = (count, type) => {
  const key = `${count}-${type}`;
  if (!iconCache.has(key)) {
    const color = type === 'Dog' ? '#3182CE' : '#805AD5';
    iconCache.set(key, L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          font-size: 14px;
        ">
          ${count}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    }));
  }
  return iconCache.get(key);
};

/**
 * StatCard Component
 * Displays summary statistics in an interactive card format
 * Supports icons, labels, values, and click handlers
 * Uses Chakra UI's color mode values for consistent theming
 */
const StatCard = React.memo(({ icon: Icon, label, value, color, location, onClick }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bg}
      p={4}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="lg"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'xl', cursor: 'pointer' }}
      onClick={onClick}
    >
      <VStack spacing={2} align="start">
        <HStack w="100%" justify="space-between">
          <Icon size={24} color={color} />
          {location && <FaMapMarkerAlt size={16} color="gray.400" />}
        </HStack>
        <Text fontSize="sm" color="gray.500">{label}</Text>
        <Text fontSize="2xl" fontWeight="bold">{value}</Text>
      </VStack>
    </Box>
  );
});

/**
 * LocationMarker Component
 * Renders individual map markers with popups showing animal counts
 * Includes a highlight circle for selected locations
 * Uses custom icons based on animal type and count
 */
const LocationMarker = React.memo(({ location, isSelected, onMarkerClick }) => {
  return (
    <React.Fragment>
      <Marker
        position={[location.latitude, location.longitude]}
        icon={getCustomIcon(location.total, location.dogs > location.cats ? 'Dog' : 'Cat')}
        eventHandlers={{
          click: () => onMarkerClick(location)
        }}
      >
        <Popup>
          <Box p={2} minW="200px">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Animal Count</Text>
            <Text fontSize="sm" mb={1}> {location.dogs} Dogs</Text>
            <Text fontSize="sm" mb={1}> {location.cats} Cats</Text>
            <Text fontSize="sm" fontWeight="bold" mt={2}>
              Total: {location.total} animals
            </Text>
          </Box>
        </Popup>
      </Marker>
      {isSelected && (
        <Circle
          center={[location.latitude, location.longitude]}
          radius={200}
          pathOptions={{
            color: '#3182CE',
            fillColor: '#3182CE',
            fillOpacity: 0.2
          }}
        />
      )}
    </React.Fragment>
  );
});

/**
 * TableRow Component
 * Renders individual rows in the animals table
 * Supports selection highlighting and click handling
 * Memoized to optimize performance with large datasets
 */
const TableRow = React.memo(({ animal, isSelected, onClick, hoverBgColor, selectedBgColor }) => (
  <Tr
    _hover={{ bg: hoverBgColor }}
    bg={isSelected ? selectedBgColor : undefined}
    transition="background-color 0.2s"
    cursor="pointer"
    onClick={() => onClick(animal)}
  >
    <Td>{animal.animal_id}</Td>
    <Td>{animal.name || 'Unnamed'}</Td>
    <Td>{animal.animal_type}</Td>
    <Td>{animal.breed}</Td>
    <Td>{animal.outcome_type}</Td>
    <Td>{animal.age_upon_outcome}</Td>
  </Tr>
));

/**
 * MapView Component
 * Main component that integrates map visualization with data table
 * Features:
 * - Interactive map with location markers
 * - Filterable and sortable data table
 * - Pagination controls
 * - Summary statistics
 * - Responsive layout
 */
const MapView = () => {
  // State management for UI interactions
  const { animals, loading, error } = useAnimals();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mapKey, setMapKey] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Theme-aware styling values
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const selectedBgColor = useColorModeValue('blue.50', 'blue.900');

  /**
   * Data Processing with useMemo
   * Processes raw animal data to:
   * - Group animals by location
   * - Calculate statistics
   * - Apply filters and sorting
   */
  const { locationGroups, stats, sortedAnimals } = useMemo(() => {
  if (!animals?.length) return { locationGroups: [], stats: null, sortedAnimals: [] };

  // Apply type filter (case-insensitive)
  const filteredAnimals = selectedFilter === 'all' 
    ? animals 
    : animals.filter(animal => animal.animal_type.toLowerCase() === selectedFilter.toLowerCase());

  const groups = new Map();
  let totalDogs = 0;
  let totalCats = 0;
  let maxDogLocation = null;
  let maxDogCount = 0;
  let maxCatLocation = null;
  let maxCatCount = 0;

  // Function to round coordinates to 4 decimal places
  const roundCoord = (coord) => Math.round(parseFloat(coord) * 10000) / 10000;

  filteredAnimals.forEach(animal => {
    if (!animal.location_lat || !animal.location_long) return;
    
    // Use rounded coordinates
    const lat = roundCoord(animal.location_lat);
    const lng = roundCoord(animal.location_long);
    const locationKey = `${lat},${lng}`;
    
    if (!groups.has(locationKey)) {
      groups.set(locationKey, {
        id: locationKey,
        latitude: lat,
        longitude: lng,
        dogs: 0,
        cats: 0,
        total: 0,
        animals: []
      });
    }

    const group = groups.get(locationKey);
    group.animals.push(animal);
    
    // Use case-insensitive comparisons
    if (animal.animal_type.toLowerCase() === 'dog') {
      group.dogs++;
      totalDogs++;
      if (group.dogs > maxDogCount) {
        maxDogCount = group.dogs;
        maxDogLocation = {
          latitude: lat,
          longitude: lng,
          count: group.dogs
        };
      }
    } else if (animal.animal_type.toLowerCase() === 'cat') {
      group.cats++;
      totalCats++;
      if (group.cats > maxCatCount) {
        maxCatCount = group.cats;
        maxCatLocation = {
          latitude: lat,
          longitude: lng,
          count: group.cats
        };
      }
    }
    group.total++;
  });

  // Sorting logic (unchanged)
  const getSortValue = (item, key) => (item[key] || '').toString().toLowerCase();
  const sorted = [...filteredAnimals].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = getSortValue(a, sortConfig.key);
    const bValue = getSortValue(b, sortConfig.key);
    return (
      sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    );
  });

  return {
    locationGroups: Array.from(groups.values()),
    stats: {
      totalDogs,
      totalCats,
      maxDogLocation,
      maxCatLocation
    },
    sortedAnimals: sorted
  };
}, [animals, sortConfig, selectedFilter]);


  // Calculate paginated subset of animals
  const paginatedAnimals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAnimals.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAnimals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAnimals.length / itemsPerPage);

  // Event Handlers
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleMarkerClick = useCallback((location) => {
    setSelectedLocation({
      latitude: location.latitude,
      longitude: location.longitude
    });
    
    // Find and select the first animal at this location
    const animalAtLocation = animals.find(animal => 
      animal.location_lat === location.latitude && 
      animal.location_long === location.longitude
    );
    
    if (animalAtLocation) {
      setSelectedAnimal(animalAtLocation);
      // Update pagination to show the selected animal
      const animalIndex = sortedAnimals.findIndex(a => a.animal_id === animalAtLocation.animal_id);
      if (animalIndex !== -1) {
        const newPage = Math.floor(animalIndex / itemsPerPage) + 1;
        setCurrentPage(newPage);
      }
    }
  }, [animals, sortedAnimals, itemsPerPage]);

  const handleRowClick = useCallback((animal) => {
    if (!animal.location_lat || !animal.location_long) return;
    
    setSelectedLocation({
      latitude: animal.location_lat,
      longitude: animal.location_long
    });
    setSelectedAnimal(animal);
  }, []);

  // Reset map and pagination when data or filter changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
    setCurrentPage(1);
  }, [animals, selectedFilter]);

  // Loading state
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box display="flex" justifyContent="center" alignItems="center" h="60vh">
          <Spinner size="xl" color="blue.500" />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
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
            Error Loading Data
          </AlertTitle>
          <AlertDescription maxWidth="sm">{error}</AlertDescription>
        </Alert>
      </Container>
    );
  }

  // Main render
  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>Animal Locations</Heading>

      {/* Animal Type Filter */}
      <Flex mb={6} gap={4} align="center">
        <Select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          width="200px"
        >
          <option value="all">All Animals</option>
          <option value="Dog">Dogs Only</option>
          <option value="Cat">Cats Only</option>
        </Select>
      </Flex>

      {/* Statistics Cards */}
      <SimpleGrid columns={2} spacing={4} mb={6}>
        <StatCard
          icon={FaDog}
          label="Most Dogs at Location"
          value={stats?.maxDogLocation?.count || 0}
          color="#3182CE"
          location={stats?.maxDogLocation}
          onClick={() => stats?.maxDogLocation && setSelectedLocation(stats.maxDogLocation)}
        />
        <StatCard
          icon={FaCat}
          label="Most Cats at Location"
          value={stats?.maxCatLocation?.count || 0}
          color="#805AD5"
          location={stats?.maxCatLocation}
          onClick={() => stats?.maxCatLocation && setSelectedLocation(stats.maxCatLocation)}
        />
      </SimpleGrid>

      {/* Map Container */}
      <Box
        bg={bg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        h="600px"
        position="relative"
        mb={8}
        shadow="sm"
      >
        <MapContainer
          key={mapKey}
          center={[30.2672, -97.7431]} // Default center coordinates
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapController 
            center={selectedLocation ? [selectedLocation.latitude, selectedLocation.longitude] : null}
            zoom={selectedLocation ? 15 : 12}
          />
          <ZoomControl position="topright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Render location markers */}
          {locationGroups.map((location) => (
            <LocationMarker
              key={location.id}
              location={location}
              isSelected={selectedLocation && 
                selectedLocation.latitude === location.latitude && 
                selectedLocation.longitude === location.longitude}
              onMarkerClick={handleMarkerClick}
            />
          ))}
        </MapContainer>
      </Box>

      {/* Data Table Section */}
      <Box
        bg={bg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        shadow="xl"
      >
        {/* Table Controls */}
        <Box p={6} borderBottomWidth="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center">
            <Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              w="auto"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </Select>
          </Flex>
        </Box>

        {/* Animals Table */}
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                {['animal_id', 'name', 'animal_type', 'breed', 'outcome_type', 'age_upon_outcome'].map((key) => (
                  <Th key={key} cursor="pointer" onClick={() => handleSort(key)}>
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    {sortConfig.key === key && (
                      <Text as="span" ml={1}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </Text>
                    )}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedAnimals.map((animal) => (
                <TableRow
                  key={animal.animal_id}
                  animal={animal}
                  isSelected={selectedAnimal?.animal_id === animal.animal_id}
                  onClick={handleRowClick}
                  hoverBgColor={hoverBgColor}
                  selectedBgColor={selectedBgColor}
                />
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination Controls */}
        <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center">
            <Text color="gray.500">
              Showing {paginatedAnimals.length} of {sortedAnimals.length} animals
            </Text>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>
              <Text alignSelf="center">
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                isDisabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default React.memo(MapView);