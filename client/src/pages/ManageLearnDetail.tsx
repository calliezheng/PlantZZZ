import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from './BackButton';
  
interface Picture {
  id: number;
  picture_file_name: string;
}
  

const ManageLearnDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pictures, setPictures] = useState<Picture[]>([]);
  const location = useLocation();
  const plant = location.state?.plant;
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/learn/${id}/pictures`);
        setPictures(response.data);
      } catch (error) {
        console.error(`Error fetching pictures for plant ${id}:`, error);
      }
    };

    if (plant) {
        setDescription(plant.description);
      }

    fetchPictures();
  }, [id]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:3001/plant/${id}`, { description });
      alert('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  if (!plant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto pt-10">
    <BackButton />
      <h1 className="text-3xl font-bold font-poetsen text-brown bg-beige mb-5"> {plant.academic_name} </h1>
      <h1 className="text-3xl font-bold font-poetsen text-brown bg-beige mb-5"> {plant.daily_name} </h1>
      <div className="flex">
        <div className="grid grid-cols-2 gap-4">
          {pictures.slice(0, 4).map((picture) => (
            <img
              key={picture.id}
              src={`http://localhost:3001/images/plants/${encodeURIComponent(picture.picture_file_name)}`}
              alt={`Plant ${id} Picture ${picture.id}`}
              className="w-60 h-60 object-cover rounded-lg"
            />
          ))}
        </div>
        <div className="ml-10">
          <div className="border-2 border-beige p-10 bg-beige" style={{ width: '960px', height: '480px'}}>
          <textarea
              className="w-full h-full p-2 text-xl"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
        <button onClick={handleSaveChanges} className="mt-5 bg-green-500 text-white p-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ManageLearnDetail;
