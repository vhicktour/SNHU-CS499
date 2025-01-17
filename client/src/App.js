import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import FilterPanel from './components/FilterPanel';
import AnimalTable from './components/AnimalTable';
import Dashboard from './components/Dashboard';

function App() {
  const [filterType, setFilterType] = useState('All');
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Logo />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Animal Shelter Dashboard
          </h1>
        </div>

        <div className="mb-6">
          <FilterPanel 
            currentFilter={filterType} 
            onFilterChange={setFilterType} 
          />
        </div>
        
        <div className="mb-8">
          <AnimalTable 
            filterType={filterType}
            onAnimalSelect={setSelectedAnimal}
          />
        </div>

        <Dashboard 
          selectedAnimal={selectedAnimal}
          filterType={filterType}
        />
      </main>
    </div>
  );
}

export default App;