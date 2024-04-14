import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RememberedPlant {
  Plant: {
    id: number;
    academic_name: string;
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
  const [filter, setFilter] = useState<string>('AB');

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

  //Create the filter function to divided plants in multiple pages 
  const handleLetterClick = (letterGroup: string) => {
    setFilter(letterGroup);
  };

  const isInFilter = (academic_name: string) => {
    return filter.split('').some(letter => academic_name.toUpperCase().startsWith(letter));
  };

  const filteredPlants = rememberedPlants.filter((rememberedPlant) =>
    isInFilter(rememberedPlant.Plant.academic_name)
  );

  const letterGroups = ['AB', 'C', 'DEFG', 'HIJK', 'LMN', 'OPQ', 'RST', 'UVW', 'XYZ'];

  return (
    <div className="container mx-auto p-4">
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPlants.map((rememberedPlant) => (
          <div key={rememberedPlant.Plant.id} className="max-w-sm rounded overflow-hidden shadow-lg p-5 m-3 bg-white">
            {rememberedPlant.Plant.Pictures && rememberedPlant.Plant.Pictures.length > 0 && (
              <img
                src={`http://localhost:3001/images/plants/${encodeURIComponent(rememberedPlant.Plant.Pictures[0].picture_file_name)}`}
                alt={rememberedPlant.Plant.daily_name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="px-6 py-4">
              <div className="font-bold text-lg mb-2">{rememberedPlant.Plant.academic_name}</div>
              <p className="text-gray-700 text-base">{rememberedPlant.Plant.daily_name}</p>
            </div>
          </div>
      ))}
      </div>
    </div>
  )
}

export default PlantLearned
