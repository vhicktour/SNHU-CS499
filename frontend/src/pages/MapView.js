import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAnimals } from '../context/AnimalsContext';

// Custom marker icon
const createCustomIcon = (count) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: #3182CE;
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
  });
};

// Default center (Austin, TX)
const DEFAULT_CENTER = [30.2672, -97.7431];
const DEFAULT_ZOOM = 12;

const MapView = () => {
  const { locations, loading, error, refreshData } = useAnimals();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const popupBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Memoize the valid locations to prevent unnecessary recalculations
  const validLocations = useMemo(() => {
    if (!Array.isArray(locations)) return [];
    
    return locations.filter(location => 
      location &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      !isNaN(location.latitude) &&
      !isNaN(location.longitude)
    );
  }, [locations]);

  // Calculate map center based on valid locations
  const mapCenter = useMemo(() => {
    if (validLocations.length === 0) return DEFAULT_CENTER;
    
    // Use the first valid location as center
    const firstLocation = validLocations[0];
    return [firstLocation.latitude, firstLocation.longitude];
  }, [validLocations]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <Spinner size="xl" color="blue.500" />
        </Box>
      </Container>
    );
  }

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
          <AlertDescription maxWidth="sm">
            {error}
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>Shelter Locations</Heading>
      
      <Box
        bg={bg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        height="600px"
        position="relative"
        boxShadow="sm"
      >
        <MapContainer
          key={`map-${mapCenter.join(',')}`}
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {validLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createCustomIcon(location.animalCount || 0)}
            >
              <Popup>
                <Box
                  p={2}
                  bg={popupBg}
                  borderRadius="md"
                  minWidth="200px"
                >
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    {location.name}
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    🐾 {location.animalCount || 0} Animals
                  </Text>
                  {location.address && (
                    <Text fontSize="sm" mb={1}>
                      📍 {location.address}
                    </Text>
                  )}
                  {location.phone && (
                    <Text fontSize="sm" color="blue.500">
                      📞 {location.phone}
                    </Text>
                  )}
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Container>
  );
};

export default MapView;
