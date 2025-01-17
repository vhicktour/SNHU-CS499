import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
                '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const BreedChart = ({ filterType }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/animals/stats/breeds');
        setData(response.data.map(item => ({
          name: item._id || 'Unknown',
          value: item.count
        })));
      } catch (error) {
        console.error('Error fetching breed stats:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [filterType]);

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BreedChart;