import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from './BackButton';

interface Plant {
    id: number;
    academic_name: string;
    daily_name: string;
    Pictures?: Picture[];
  }
  
  interface Picture {
    id: number;
    picture_file_name: string;
  }
  

const LearnDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pictures, setPictures] = useState<Picture[]>([]);
  const location = useLocation();
  const plant = location.state?.plant;

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/learn/${id}/pictures`);
        setPictures(response.data);
      } catch (error) {
        console.error(`Error fetching pictures for plant ${id}:`, error);
      }
    };

    fetchPictures();
  }, [id]);

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
            <p className="text-xl">{plant.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnDetail;
