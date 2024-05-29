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
  const [newPicture, setNewPicture] = useState<File | null>(null);
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

  const handleSaveDescription = async () => {
    try {
      await axios.put(`http://localhost:3001/plant/description/${id}`, { description });
      alert('Description updated successfully');
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleAddPicture = async () => {
    if (!newPicture) return;

    const formData = new FormData();
    formData.append('picture', newPicture);

    try {
      const response = await axios.post(`http://localhost:3001/plant/addpicture/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Picture add successfully');
      setPictures([...pictures, response.data]);
      setNewPicture(null);
    } catch (error) {
      console.error('Error adding picture:', error);
    }
  };

  const handleDeletePicture = async (pictureId: number) => {
    try {
      await axios.patch(`http://localhost:3001/plant/deactivatepicture/${pictureId}`);
      alert('Picture delete successfully');
      setPictures(pictures.filter(picture => picture.id !== pictureId));
    } catch (error) {
      console.error('Error deleting picture:', error);
    }
  };

  if (!plant) {
    return <div>Loading...</div>;
  }

  return (
<div className="container mx-auto pt-10">
      <BackButton />
      <h1 className="text-3xl font-bold font-poetsen text-brown bg-beige mb-5">{plant.academic_name}</h1>
      <h1 className="text-3xl font-bold font-poetsen text-brown bg-beige mb-5">{plant.daily_name}</h1>
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-4 mb-10 mr-10">
            {pictures.map((picture) => (
              <div key={picture.id} className="relative">
                <img
                  src={`http://localhost:3001/images/plants/${encodeURIComponent(picture.picture_file_name)}`}
                  alt={`Plant ${id} Picture ${picture.id}`}
                  className="w-60 h-60 object-cover rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                  onClick={() => handleDeletePicture(picture.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mb-5">
            <input type="file" onChange={(e) => setNewPicture(e.target.files ? e.target.files[0] : null)} />
            <button onClick={handleAddPicture} className="ml-2 bg-green-700 text-white p-2 rounded">
              Add Picture
            </button>
          </div>
        </div>
        <div className="relative border-2 border-beige p-10 bg-beige" style={{ width: '600px', height: '480px'}}>
          <textarea
            className="w-full h-full p-2 text-xl"
            value={description}
            onChange={handleDescriptionChange}
          />
          <button
            onClick={handleSaveDescription}
            className="absolute bottom-2 right-2 bg-green-700 text-white p-1 rounded text-sm"
          >
            Save Description
          </button>
        </div>
      </div>
    </div>
   );
};

export default ManageLearnDetail;
