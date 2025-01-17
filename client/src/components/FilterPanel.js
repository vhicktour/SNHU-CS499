import React from 'react';
import { RadioGroup } from './ui/RadioGroup';


const FilterPanel = ({ currentFilter, onFilterChange }) => {
  const filterOptions = [
    { label: 'All Animals', value: 'All' },
    { label: 'Water Rescue', value: 'Water' },
    { label: 'Mountain/Wilderness Rescue', value: 'Mountain' },
    { label: 'Disaster/Individual Tracking', value: 'Disaster' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Filter Animals by Rescue Type</h2>
      <RadioGroup
        value={currentFilter}
        onValueChange={onFilterChange}
        className="flex flex-col space-y-2"
      >
        {filterOptions.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroup.Item value={option.value} id={option.value} />
            <label htmlFor={option.value} className="text-sm font-medium">
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterPanel;