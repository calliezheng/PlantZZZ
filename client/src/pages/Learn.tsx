import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Plant {
  id?: number;
  acadamic_name: string;
  daily_name: string;
  Pictures?: Picture[];
}

interface Picture {
  id: number;
  picture_file_name: string;
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
            {plant.Pictures && plant.Pictures[0] && (
              <img className="w-full" 
              style={{
                width: '100%', // This will make the image responsive and fill the container
                height: '200px', // Replace with the height you want
                objectFit: 'cover' // This will cover the area without stretching the image
              }}
              src={plant.Pictures && plant.Pictures.length > 0 ? `/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}` : '/images/plants/picture_is_missing.png'} />
            )}
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{plant.acadamic_name}</div>
              <p className="text-gray-700 text-xl">
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
