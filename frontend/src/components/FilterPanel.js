import React from 'react';
import {
  Box,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Button,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tag,
  TagLabel,
  Divider,
} from '@chakra-ui/react';
import {
  FaDog,
  FaCat,
  FaFeather,
  FaHeart,
  FaHome,
  FaUserFriends,
  FaQuestion,
  FaFilter,
} from 'react-icons/fa';
import { useAnimals } from '../context/AnimalsContext';

const FilterButton = ({ isActive, icon: IconComponent, children, onClick }) => {
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const inactiveBg = useColorModeValue('gray.50', 'gray.700');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  return (
    <Button
      variant="outline"
      bg={isActive ? activeBg : inactiveBg}
      color={isActive ? activeColor : inactiveColor}
      borderColor={isActive ? 'blue.200' : 'transparent'}
      leftIcon={<Icon as={IconComponent} />}
      onClick={onClick}
      size="md"
      width="full"
      _hover={{
        bg: isActive ? activeBg : hoverBg,
      }}
    >
      {children}
    </Button>
  );
};

const FilterSection = ({ title, children }) => {
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <Box mb={6}>
      <Flex align="center" mb={3}>
        <Icon as={FaFilter} color={iconColor} mr={2} />
        <Text fontSize="sm" fontWeight="medium" textTransform="uppercase" letterSpacing="wide" color={textColor}>
          {title}
        </Text>
      </Flex>
      {children}
    </Box>
  );
};

export default function FilterPanel() {
  const { filters, updateFilters, allAnimals } = useAnimals();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  // Get available breeds based on selected animal type
  const getAvailableBreeds = () => {
    if (!allAnimals) return [];
    const filteredAnimals = filters.animalType === 'all' 
      ? allAnimals 
      : allAnimals.filter(animal => animal.type === filters.animalType);
    
    return [...new Set(filteredAnimals.map(animal => animal.breed))].sort();
  };

  const rescueTypes = [
    { id: 'all', label: 'All Rescues', icon: FaFeather },
    { id: 'water', label: 'Water Rescue', icon: FaHeart },
    { id: 'mountain', label: 'Mountain Rescue', icon: FaHome },
    { id: 'disaster', label: 'Disaster Rescue', icon: FaQuestion },
  ];

  const animalTypes = [
    { id: 'all', label: 'All Types', icon: FaUserFriends },
    { id: 'dog', label: 'Dogs', icon: FaDog },
    { id: 'cat', label: 'Cats', icon: FaCat },
  ];

  const availableBreeds = getAvailableBreeds();

  return (
    <Box bg={bg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" p={6} shadow="xl">
      <Stack spacing={8}>
        {/* Header Section */}
        <Box bg={useColorModeValue('blue.50', 'blue.900')} p={6} rounded="xl" mb={2}>
          <Flex align="center" mb={3}>
            <Icon as={FaHeart} w={6} h={6} color={useColorModeValue('blue.500', 'blue.200')} mr={3} />
            <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.200')}>
              Find Your Perfect Match
            </Text>
          </Flex>
          <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="md">
            Discover amazing rescue animals waiting for their forever homes.
          </Text>
        </Box>

        <Divider />

        {/* Rescue Type Section */}
        <FilterSection title="Rescue Type">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            {rescueTypes.map(({ id, label, icon }) => (
              <FilterButton
                key={id}
                isActive={filters.type === id}
                icon={icon}
                onClick={() => updateFilters({ type: id })}
              >
                {label}
              </FilterButton>
            ))}
          </SimpleGrid>
        </FilterSection>

        {/* Animal Type Section */}
        <FilterSection title="Animal Type">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            {animalTypes.map(({ id, label, icon }) => (
              <FilterButton
                key={id}
                isActive={filters.animalType === id}
                icon={icon}
                onClick={() => {
                  updateFilters({ 
                    animalType: id,
                    breed: 'all' // Reset breed when animal type changes
                  });
                }}
              >
                {label}
              </FilterButton>
            ))}
          </SimpleGrid>
        </FilterSection>

        {/* Dynamic Breed Section */}
        <FilterSection title="Breed">
          <Select
            value={filters.breed}
            onChange={(e) => updateFilters({ breed: e.target.value })}
            bg={useColorModeValue('white', 'gray.700')}
            borderColor={useColorModeValue('gray.200', 'gray.600')}
          >
            <option value="all">All Breeds</option>
            {availableBreeds.map(breed => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </Select>
        </FilterSection>

        {/* Outcome Section */}
        <FilterSection title="Outcome">
          <Select
            value={filters.outcome}
            onChange={(e) => updateFilters({ outcome: e.target.value })}
            bg={useColorModeValue('white', 'gray.700')}
            borderColor={useColorModeValue('gray.200', 'gray.600')}
          >
            <option value="all">All Outcomes</option>
            <option value="adoption">Adoption</option>
            <option value="foster">Foster</option>
            <option value="return">Return to Owner</option>
          </Select>
        </FilterSection>

        {/* Age Range Section */}
        <FilterSection title="Age Range (years)">
          <Box px={2}>
            <RangeSlider
              value={filters.age}
              min={0}
              max={20}
              step={1}
              onChange={(value) => updateFilters({ age: value })}
            >
              <RangeSliderTrack bg={useColorModeValue('gray.200', 'gray.600')}>
                <RangeSliderFilledTrack bg={useColorModeValue('blue.500', 'blue.200')} />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} boxSize={6}>
                <Box color="blue.500" as={FaHeart} />
              </RangeSliderThumb>
              <RangeSliderThumb index={1} boxSize={6}>
                <Box color="blue.500" as={FaHeart} />
              </RangeSliderThumb>
            </RangeSlider>
            <Flex justify="space-between" mt={2}>
              <Tag size="sm" variant="subtle" colorScheme="blue">
                <TagLabel>{filters.age[0]} years</TagLabel>
              </Tag>
              <Tag size="sm" variant="subtle" colorScheme="blue">
                <TagLabel>{filters.age[1]} years</TagLabel>
              </Tag>
            </Flex>
          </Box>
        </FilterSection>
      </Stack>
    </Box>
  );
}