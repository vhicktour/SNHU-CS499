import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/Table';
import { Input } from './ui/Input';
import axios from 'axios';

const AnimalTable = ({ filterType, onAnimalSelect }) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const endpoint = filterType === 'All' 
          ? '/api/animals'
          : `/api/animals/rescue/${filterType.toLowerCase()}`;
          
        const response = await axios.get(endpoint);
        setAnimals(response.data);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
      setLoading(false);
    };

    fetchAnimals();
  }, [filterType]);

  const filteredAnimals = animals.filter(animal => 
    Object.values(animal).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <Input
          placeholder="Search animals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAnimals.map((animal) => (
              <TableRow 
                key={animal._id}
                onClick={() => onAnimalSelect(animal)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{animal.name || 'Unknown'}</TableCell>
                <TableCell>{animal.breed}</TableCell>
                <TableCell>{animal.age_upon_outcome}</TableCell>
                <TableCell>{animal.sex_upon_outcome}</TableCell>
                <TableCell>{animal.animal_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AnimalTable;