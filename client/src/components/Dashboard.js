import React from 'react';
import { Card } from './ui/Card';
import BreedChart from './charts/BreedChart';
import AnimalMap from './AnimalMap';

const Dashboard = ({ selectedAnimal, filterType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Breed Distribution</h3>
        <BreedChart filterType={filterType} />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Animal Location</h3>
        <AnimalMap 
          center={[30.75, -97.48]} 
          zoom={10}
          selectedAnimal={selectedAnimal}
        />
      </Card>
    </div>
  );
};

export default Dashboard;