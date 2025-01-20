import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import Dashboard from './components/Dashboard';
import StatsOverview from './components/StatsOverview';
import Statistics from './pages/Statistics';
import MapView from './pages/MapView';
import { AnimalsProvider } from './context/AnimalsContext';

// Home page component that includes the original dashboard layout
const Home = () => (
  <>
    <HeroSection />
    <Box px={4} py={8} width="100%">
      <Box display="flex" flexDirection="column" gap={8}>
        <StatsOverview />
        <FilterPanel />
        
        <Box 
          display="grid" 
          gap={8} 
          width="100%"
          gridTemplateColumns={{ 
            base: "1fr", 
            xl: "3fr 1fr" 
          }}
        >
          <Box width="100%">
            <DataTable />
          </Box>
          <Box width="100%">
            <Dashboard />
          </Box>
        </Box>
      </Box>
    </Box>
  </>
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AnimalsProvider>
        <Router>
          <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/map" element={<MapView />} />
            </Routes>
          </Box>
        </Router>
      </AnimalsProvider>
    </ChakraProvider>
  );
}

export default App;
