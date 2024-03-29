import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Plant {
    id: number;
    acadamic_name: string;
    daily_name: string;
  }
  
const Learn = () => {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get('http://localhost:3001/learn');
        setPlants(response.data);  
      } catch (error) {
        console.error('Error fetching plant data:', error);
      }
    };

    fetchPlants();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-5">Learn About Plants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <div key={plant.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src="/img/plant.jpg" alt="Picture not found" /> {/* Replace with your image path */}
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{plant.acadamic_name}</div>
              <p className="text-gray-700 text-base">
                {plant.daily_name}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              {/* Add tags or other information here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
