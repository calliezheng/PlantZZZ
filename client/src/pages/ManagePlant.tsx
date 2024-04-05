import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

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

const validationSchema = Yup.object().shape({
  acadamic_name: Yup.string()
    .required('Academic name is required'),
  daily_name: Yup.string()
    .required('Daily name is required'),
});

function ManagePlant() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setSelectedFile(event.currentTarget.files[0]);
    }
  };

  const handleAddPlant = async (values: Plant, actions: FormikHelpers<Plant>) => {
    const formData = new FormData();
    formData.append('acadamic_name', values.acadamic_name);
    formData.append('daily_name', values.daily_name);
    if (selectedFile) {
      formData.append('picture', selectedFile);
    }
    try {
      const response = await axios.post('http://localhost:3001/plant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        },
      });
      setPlants([...plants, response.data]);
      setIsAdding(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
    actions.setSubmitting(false);
  };

  const handleUpdatePlant = async (values: Plant, actions: FormikHelpers<Plant>) => {
    try {
      if (editingPlant && editingPlant.id) {
        const response = await axios.put(`http://localhost:3001/plant/${editingPlant.id}`, values);
        setPlants(plants.map((p) => (p.id === editingPlant.id ? response.data : p)));
        setEditingPlant(null);
      }
    } catch (error) {
      console.error('Error updating plant:', error);
    }
    actions.setSubmitting(false);
  };

  const handleDeletePlant = async (id?: number) => {
    if (id) {
      try {
        await axios.delete(`http://localhost:3001/plant/${id}`);
        setPlants(plants.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting plant:', error);
      }
    }
  };

  return (
    <div>
      {isAdding && (
        <Formik
          initialValues={{
            acadamic_name: '',
            daily_name: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddPlant}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="acadamic_name" type="text" placeholder="Academic Name" />
              <ErrorMessage name="acadamic_name" component="div" />
              <Field name="daily_name" type="text" placeholder="Daily Name" />
              <ErrorMessage name="daily_name" component="div" />
              <input id="picture" name="picture" type="file" onChange={handleFileChange} />
              <button type="submit" disabled={isSubmitting}>
                Add Plant
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </Form>
          )}
        </Formik>
      )}
      {editingPlant && (
        <Formik
          initialValues={{
            acadamic_name: editingPlant.acadamic_name,
            daily_name: editingPlant.daily_name,
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdatePlant}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="acadamic_name" type="text" placeholder="Academic Name" />
              <ErrorMessage name="acadamic_name" component="div" />
              <Field name="daily_name" type="text" placeholder="Daily Name" />
              <ErrorMessage name="daily_name" component="div" />
              <input id="file" name="file" type="file" onChange={handleFileChange} />
              <button type="submit" disabled={isSubmitting}>
                Update Plant
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </Form>
          )}
        </Formik>
      )}
      <button onClick={() => setIsAdding(true)}>Add New Plant</button>
    
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
              <p className="text-gray-700 text-base">
                {plant.daily_name}
              </p>
            </div>
            <button onClick={() => setEditingPlant(plant)}>Edit</button>
            <button onClick={() => handleDeletePlant(plant.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagePlant;
