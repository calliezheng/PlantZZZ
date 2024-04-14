import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RememberedPlant {
  Plant: {
    id: number;
    acadamic_name: string;
    daily_name: string;
    Pictures: Picture[]; // This should match the structure coming from the API
  };
}

interface Picture {
  id: number;
  picture_file_name: string;
}

function PlantLearned() {

  const userId = localStorage.getItem('user_id');
  const [rememberedPlants, setRememberedPlants] = useState<RememberedPlant[]>([]);

  useEffect(() => {
    const fetchRememberedPlants = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/plant-remembered/${userId}`); 
        console.log(response.data);
        setRememberedPlants(response.data);
      } catch (error) {
        console.error('Error fetching remembered plants:', error);
      }
    };

    fetchRememberedPlants();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rememberedPlants.map((rememberedPlant) => (
          <div key={rememberedPlant.Plant.id} className="max-w-sm rounded overflow-hidden shadow-lg p-5 m-3 bg-white">
            {rememberedPlant.Plant.Pictures && rememberedPlant.Plant.Pictures.length > 0 && (
              <img
                src={`http://localhost:3001/images/plants/${encodeURIComponent(rememberedPlant.Plant.Pictures[0].picture_file_name)}`}
                alt={rememberedPlant.Plant.daily_name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="px-6 py-4">
              <div className="font-bold text-lg mb-2">{rememberedPlant.Plant.acadamic_name}</div>
              <p className="text-gray-700 text-base">{rememberedPlant.Plant.daily_name}</p>
            </div>
          </div>
      ))}
      </div>
    </div>
  )
}

export default PlantLearned
