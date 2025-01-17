import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/Table';
import { Input } from './ui/Input';
import Map from './Map';
import axios from 'axios';

const AnimalTable = ({ filterType, onAnimalSelect }) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const itemsPerPage = 10;
  
  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const endpoint = filterType === 'All' 
          ? `/api/animals?page=${currentPage}&limit=${itemsPerPage}`
          : `/api/animals/rescue/${filterType.toLowerCase()}?page=${currentPage}&limit=${itemsPerPage}`;
          
        const response = await axios.get(endpoint);
        setAnimals(response.data.animals);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
      setLoading(false);
    };

    fetchAnimals();
  }, [filterType, currentPage]);

  const columns = [
    { field: 'animal_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'animal_type', headerName: 'Type', flex: 1 },
    { field: 'breed', headerName: 'Breed', flex: 1.5 },
    { field: 'color', headerName: 'Color', flex: 1 },
    { 
      field: 'date_of_birth', 
      headerName: 'Birth Date', 
      flex: 1,
      valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { 
      field: 'age_upon_outcome', 
      headerName: 'Age', 
      flex: 1 
    },
    { 
      field: 'age_upon_outcome_in_weeks', 
      headerName: 'Age (Weeks)', 
      flex: 1,
      valueFormatter: (value) => value ? Math.round(value) : '-'
    },
    { field: 'sex_upon_outcome', headerName: 'Sex', flex: 1 },
    { field: 'outcome_type', headerName: 'Outcome', flex: 1 },
    { field: 'outcome_subtype', headerName: 'Subtype', flex: 1 },
    { 
      field: 'datetime', 
      headerName: 'Date', 
      flex: 1,
      valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { 
      field: 'monthyear', 
      headerName: 'Month/Year', 
      flex: 1 
    },
    { 
      field: 'location', 
      headerName: 'Location (Longitude - Latitude)', 
      flex: 1.5,
      valueFormatter: (_, animal) => {
        if (animal.location_lat && animal.location_long) {
          return `${animal.location_long.toFixed(4)}, ${animal.location_lat.toFixed(4)}`;
        }
        return '-';
      }
    }
  ];

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.key === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: field, direction });
  };

  const sortedAnimals = React.useMemo(() => {
    if (!sortConfig.key) return animals;

    return [...animals].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [animals, sortConfig]);

  const filteredAnimals = sortedAnimals.filter(animal => 
    Object.values(animal).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRowClick = (animal) => {
    setSelectedAnimal(animal);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search animals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-gray-600">
          Total Animals: {totalCount}
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                  className="cursor-pointer"
                >
                  {column.headerName}
                  {sortConfig.key === column.field && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAnimals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No animals found
                </TableCell>
              </TableRow>
            ) : (
              filteredAnimals.map((animal) => (
                <TableRow 
                  key={animal.animal_id}
                  onClick={() => handleRowClick(animal)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {column.valueFormatter
                        ? column.valueFormatter(animal[column.field], animal)
                        : animal[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedAnimal && (
        <div className="mt-4 border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Selected Animal's Location</h3>
          <Map 
            location={{ 
              lat: selectedAnimal.location_lat, 
              long: selectedAnimal.location_long 
            }} 
            animal={selectedAnimal} 
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {Math.min(itemsPerPage, animals.length)} of {totalCount} animals
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalTable;