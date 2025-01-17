import React, { useState } from 'react';
import { Container } from './components/ui/Container';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import AnimalTable from './components/AnimalTable';
import Dashboard from './components/Dashboard';

function App() {
  const [filterType, setFilterType] = useState('All');
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <Container className="py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Animal Shelter Dashboard
          </h1>
        </div>

        <FilterPanel 
          currentFilter={filterType} 
          onFilterChange={setFilterType} 
        />
        
        <div className="mt-6">
          <AnimalTable 
            filterType={filterType}
            onAnimalSelect={setSelectedAnimal}
          />
        </div>

        <div className="mt-8">
          <Dashboard 
            selectedAnimal={selectedAnimal}
            filterType={filterType}
          />
        </div>
      </Container>
    </div>
  );
}

export default App;