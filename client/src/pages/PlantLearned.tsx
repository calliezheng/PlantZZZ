import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Plant {
  id: number;
  acadamic_name: string;
  daily_name: string;
  Pictures?: Picture[];
}

interface Picture {
  id: number;
  picture_file_name: string;
}

function PlantLearned() {

  const [rememberedPlants, setRememberedPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchRememberedPlants = async () => {
      try {
        const response = await axios.get('http://localhost:3001/plant-remembered/:userId'); 
        setRememberedPlants(response.data);
      } catch (error) {
        console.error('Error fetching remembered plants:', error);
      }
    };

    fetchRememberedPlants();
  }, []);

  return (
    <div className="container">
      <h1 className="text-xl font-bold text-center my-4">Remembered Plants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rememberedPlants.map((plant) => (
          <div key={plant.id} className="max-w-sm rounded overflow-hidden shadow-lg p-5 m-3 bg-white">
            <img
              src={plant.Pictures && plant.Pictures.length > 0 
                ? `http://localhost:3001/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}` 
                : '/images/plants/picture_is_missing.png'}
              alt={plant.daily_name}
              className="w-full h-48 object-cover"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-lg mb-2">{plant.acadamic_name}</div>
              <p className="text-gray-700 text-base">{plant.daily_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlantLearned
