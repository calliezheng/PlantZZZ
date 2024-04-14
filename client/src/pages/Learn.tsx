import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Define the type for Typescript 
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

const Learn = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filter, setFilter] = useState<string>('AB');
  const [showRemembered, setShowRemembered] = useState(false);
  const [rememberedPlants, setRememberedPlants] = useState<{ [key: number]: boolean }>({});

  // Function to fetch remembered plants from the backend
  const fetchRememberedPlants = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/plant-remembered/${userId}`);
      const remembered = response.data.reduce((acc: { [key: number]: boolean }, plant: any) => {
        acc[plant.Plant.id] = true;
        return acc;
      }, {});
      setRememberedPlants(remembered);
    } catch (error) {
      console.error('Error fetching remembered plants:', error);
    }
  };

  // Effect to fetch plants data
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

  // Effect to fetch remembered plants when a user is logged in
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetchRememberedPlants(userId);
    }
  }, []);

  // Pass the remembered plant id with user id if signed in to the back end 
  const handleRememberToggle = async (plantId: number) => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      console.error('User is not logged in');
      return;
    }

    const newRememberedState = !rememberedPlants[plantId];
    setRememberedPlants(prev => ({ ...prev, [plantId]: newRememberedState }));

    try {
      await axios.post(`http://localhost:3001/plant-remembered/${userId}/add-remembered-plant`, {
        user_id: userId,
        plant_id: plantId,
        remember: newRememberedState,
      });

      // re-fetch the remembered plants to keep the state consistent with the database
      fetchRememberedPlants(userId);

    } catch (error) {
      console.error('Error updating remembered plants:', error);
    }
  };
  
  //Create the filter function to divided plants in multiple pages 
  const handleLetterClick = (letterGroup: string) => {
    setFilter(letterGroup);
  };

  const filteredPlants = plants.filter((plant) => {
    const firstLetter = plant.acadamic_name[0].toUpperCase();
    const isInFilter = filter.includes(firstLetter);
    return (showRemembered || !rememberedPlants[plant.id]) && isInFilter;
  });

  const letterGroups = ['AB', 'C', 'DEFG', 'HIJK', 'LMN', 'OPQ', 'RST', 'UVW', 'XYZ'];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-5">Learn About Plants</h1>
      <div>
        {letterGroups.map((group) => (
          <button
            key={group}
            onClick={() => handleLetterClick(group)}
            className={`${filter === group ? 'font-bold bg-gray-300' : 'bg-gray-100'} text-sm px-4 py-2 rounded hover:bg-gray-200 focus:outline-none`}
          >
            {group}
          </button>
        ))}
        <label className="ml-4">
          <input type="checkbox" checked={showRemembered} onChange={() => setShowRemembered(!showRemembered)} /> Show Remembered
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlants.map((plant) => (
          <div key={plant.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            {plant.Pictures && plant.Pictures[0] && (
              <img
                className="w-full"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                src={plant.Pictures.length > 0 ? `http://localhost:3001/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}` : '/images/plants/picture_is_missing.png'}
                alt={plant.daily_name}
              />
            )}
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{plant.acadamic_name}</div>
              <p className="text-gray-700 text-base">{plant.daily_name}</p>
            </div>
            <label className="px-6 py-4">
              <input type="checkbox" checked={!!rememberedPlants[plant.id]} onChange={() => handleRememberToggle(plant.id)} /> Remembered
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
