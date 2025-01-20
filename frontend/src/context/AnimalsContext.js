import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const AnimalsContext = createContext();

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export function AnimalsProvider({ children }) {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    animalType: 'all',
    breed: 'all',
    age: [0, 20],
    outcome: 'all'
  });

  // Function to apply filters locally
  const applyFilters = useCallback((data, currentFilters) => {
    return data.filter(animal => {
      // Type filter
      if (currentFilters.type !== 'all' && animal.rescueType !== currentFilters.type) {
        return false;
      }

      // Animal type filter
      if (currentFilters.animalType !== 'all' && animal.type !== currentFilters.animalType) {
        return false;
      }

      // Breed filter
      if (currentFilters.breed !== 'all' && animal.breed !== currentFilters.breed) {
        return false;
      }

      // Age filter
      const animalAge = animal.age;
      if (animalAge < currentFilters.age[0] || animalAge > currentFilters.age[1]) {
        return false;
      }

      // Outcome filter
      if (currentFilters.outcome !== 'all' && animal.outcome !== currentFilters.outcome) {
        return false;
      }

      return true;
    });
  }, []);

  const fetchAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/animals');
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected an array');
      }

      setAnimals(response.data);
      // Apply filters to the fetched data
      const filtered = applyFilters(response.data, filters);
      setFilteredAnimals(filtered);
      setError(null);
    } catch (err) {
      console.error('Error fetching animals:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch animals';
      setError(errorMessage);
      setAnimals([]);
      setFilteredAnimals([]);
    } finally {
      setLoading(false);
    }
  }, [filters, applyFilters]);

  // Update filtered animals whenever filters or animals change
  useEffect(() => {
    const filtered = applyFilters(animals, filters);
    setFilteredAnimals(filtered);
  }, [filters, animals, applyFilters]);

  const fetchStats = useCallback(async () => {
    try {
      const [breedStats, overview, locationData] = await Promise.all([
        api.get('/api/animals/stats/breed'),
        api.get('/api/animals/stats/overview'),
        api.get('/api/animals/location/coordinates')
      ]);

      setStats({
        breedStats: breedStats.data.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        overview: {
          totalAnimals: overview.data.total || 0,
          dogCount: overview.data.dogs || 0,
          catCount: overview.data.cats || 0,
          averageAge: overview.data.avgAge || 0,
          adoptionsThisMonth: overview.data.adoptionsLastMonth || 0,
          newArrivals: overview.data.newArrivalsLastMonth || 0
        }
      });
      setLocations(locationData.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message);
      setStats(null);
      setLocations([]);
    }
  }, []);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnimals();
    fetchStats();
  }, [fetchAnimals, fetchStats]);

  const value = {
    animals: filteredAnimals, // Use filtered animals instead of all animals
    allAnimals: animals, // Keep access to unfiltered data if needed
    loading,
    error,
    stats,
    locations,
    filters,
    updateFilters,
    refreshData: fetchAnimals
  };

  return (
    <AnimalsContext.Provider value={value}>
      {children}
    </AnimalsContext.Provider>
  );
}

export const useAnimals = () => {
  const context = useContext(AnimalsContext);
  if (!context) {
    throw new Error('useAnimals must be used within an AnimalsProvider');
  }
  return context;
};