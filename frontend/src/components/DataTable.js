import React, { useState, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  useColorModeValue,
  Flex,
  Stack,
  Select,
  Button,
} from '@chakra-ui/react';
import {
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import { useAnimals } from '../context/AnimalsContext';

const DataTable = () => {
  const { animals, loading, error } = useAnimals();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const filteredAnimals = useMemo(() => {
    if (!animals) return [];
    return animals;
  }, [animals]);

  const sortedAnimals = useMemo(() => {
    const sorted = [...filteredAnimals];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = (a[sortConfig.key] || '').toString().toLowerCase();
        const bValue = (b[sortConfig.key] || '').toString().toLowerCase();
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredAnimals, sortConfig]);

  const paginatedAnimals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAnimals.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAnimals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAnimals.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <TriangleDownIcon />;
    return sortConfig.direction === 'asc' ? <TriangleDownIcon /> : <TriangleUpIcon />;
  };

  if (loading) {
    return (
      <Box
        p={6}
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        shadow="xl"
      >
        <Text mt={4} color="gray.500">Loading animals...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        p={6}
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        shadow="xl"
      >
        <Text color="red.500">Error: {error}</Text>
        <Button mt={4} colorScheme="blue" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      shadow="xl"
    >
      <Box p={6} borderBottomWidth="1px" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <Select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            width="auto"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </Select>
        </Flex>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('animal_id')}>
                <Stack spacing={2}>
                  <Text>ID</Text>
                  {getSortIcon('animal_id')}
                </Stack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('name')}>
                <Stack spacing={2}>
                  <Text>Name</Text>
                  {getSortIcon('name')}
                </Stack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('breed')}>
                <Stack spacing={2}>
                  <Text>Breed</Text>
                  {getSortIcon('breed')}
                </Stack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('sex_upon_outcome')}>
                <Stack spacing={2}>
                  <Text>Sex</Text>
                  {getSortIcon('sex_upon_outcome')}
                </Stack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('age_upon_outcome_in_weeks')}>
                <Stack spacing={2}>
                  <Text>Age</Text>
                  {getSortIcon('age_upon_outcome_in_weeks')}
                </Stack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('outcome_type')}>
                <Stack spacing={2}>
                  <Text>Outcome</Text>
                  {getSortIcon('outcome_type')}
                </Stack>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedAnimals.map((animal) => (
              <Tr
                key={animal.animal_id}
                _hover={{ bg: hoverBg }}
                transition="background-color 0.2s"
              >
                <Td>{animal.animal_id}</Td>
                <Td>{animal.name || 'Unnamed'}</Td>
                <Td>
                  <Text>{animal.breed}</Text>
                </Td>
                <Td>{animal.sex_upon_outcome}</Td>
                <Td>
                  {Math.round(animal.age_upon_outcome_in_weeks / 52 * 10) / 10} years
                </Td>
                <Td>
                  <Text>{animal.outcome_type}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <Text color="gray.500">
            Showing {paginatedAnimals.length} of {sortedAnimals.length} rescued animals
          </Text>
          <Flex spacing={2}>
            <Button
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text>
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
  );
};

export default DataTable;
