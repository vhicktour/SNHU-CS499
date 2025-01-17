import React from 'react';

const FilterPanel = ({ currentFilter, onFilterChange }) => {
  const filterOptions = [
    { label: 'All Animals', value: 'All' },
    { label: 'Water Rescue', value: 'Water' },
    { label: 'Mountain/Wilderness Rescue', value: 'Mountain' },
    { label: 'Disaster/Individual Tracking', value: 'Disaster' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Filter Animals by Rescue Type
      </h2>
      <hr className="mb-4" />
      <div className="flex flex-wrap justify-center gap-4">
        {filterOptions.map(option => (
          <label
            key={option.value}
            className={`
              flex items-center px-4 py-2 rounded-full cursor-pointer transition-colors
              ${currentFilter === option.value 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
          >
            <input
              type="radio"
              name="filter"
              value={option.value}
              checked={currentFilter === option.value}
              onChange={(e) => onFilterChange(e.target.value)}
              className="hidden"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;