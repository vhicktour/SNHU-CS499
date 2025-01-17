import React from 'react';
import { Card } from './ui/Card';
import BreedChart from './charts/BreedChart';

const Dashboard = ({ selectedAnimal, filterType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Breed Distribution</h3>
        <BreedChart filterType={filterType} />
      </Card>
    </div>
  );
};

export default Dashboard;