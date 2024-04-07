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
  const [updatedFiles, setUpdatedFiles] = useState<{[key: number]: File | null }>({});
  const [filter, setFilter] = useState<string>('AB');


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

  const handleLetterClick = (letterGroup: string) => {
    setFilter(letterGroup);
  };

  const filteredPlants = plants.filter((plant) => {
    const firstLetter = plant.acadamic_name[0].toUpperCase();
    return filter.includes(firstLetter);
  });
  
  const letterGroups = ['AB', 'C', 'DEFG', 'HIJK', 'LMN', 'OPQ', 'RST', 'UVW', 'XYZ'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, plantId?: number) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      if (plantId) {
        // Handle file selection for editing
        setUpdatedFiles({ ...updatedFiles, [plantId]: file });
      } else {
        // Handle file selection for adding
        setSelectedFile(file);
      }
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
      setPlants(currentPlants => [...currentPlants, response.data]);
      setIsAdding(false);
      setSelectedFile(null);
      alert('New Plant added successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding plant:', error);
    }
    actions.setSubmitting(false);
  };

  const handleUpdatePlant = async (values: Plant, actions: FormikHelpers<Plant>) => {
    // Check if there's an editing plant and if it has an ID
    if (!editingPlant || editingPlant.id === undefined) {
      console.error('Error updating plant: editingPlant is not defined or lacks an ID');
      return;
    }
  
    // Prepare FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('acadamic_name', values.acadamic_name);
    formData.append('daily_name', values.daily_name);
    
    const updatedPicture = updatedFiles[editingPlant.id];
    if (updatedPicture) {
      formData.append('picture', updatedPicture);
    }
  
    try {
      // Send the update request with formData
      const response = await axios.put(`http://localhost:3001/plant/${editingPlant.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Update the state to reflect the changes
      setPlants(currentPlants =>
        currentPlants.map(plant => (plant.id === editingPlant.id ? { ...plant, ...response.data } : plant))
    );
      
      // Reset editing plant and selected file
      setEditingPlant(null);
      alert('Plant updated successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error updating plant:', error);
    } finally {
      // Stop the form submission process
      actions.setSubmitting(false);
    }
  };
  

  const handleDeletePlant = async (id?: number) => {
    if (id) {
      try {
        const response = await axios.patch(`http://localhost:3001/plant/deactivate/${id}`); 
        if(response.status === 204) {
          alert('Plant deleted successfully');
          setPlants(currentPlants => currentPlants.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deactivating plant:', error);
      }
    }
};


  return (
    <div className="container mx-auto p-4">
      <div>
        {letterGroups.map((group) => (
          <button
            key={group}
            onClick={() => handleLetterClick(group)}
            className={`${
              filter === group ? 'font-bold bg-gray-300' : 'bg-gray-100'
            } text-sm px-4 py-2 rounded hover:bg-gray-200 focus:outline-none`}
          >
            {group}
          </button>
        ))}
      </div>
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
              <button type="submit" disabled={isSubmitting}>Add Plant</button>
              <button
                type="button"
                onClick={() => setIsAdding(false)} 
                disabled={isSubmitting}
              >Cancel</button>
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
              <input id="picture" name="picture" type="file" onChange={(e) => handleFileChange(e, editingPlant?.id)} />
              <button type="submit" disabled={isSubmitting}>Update Plant</button>
              <button type="button" onClick={() => setEditingPlant(null)}>Cancel</button>
            </Form>
          )}
        </Formik>
      )}
      <button onClick={() => setIsAdding(true)}>Add New Plant</button>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPlants.map((plant) => (
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
              <button onClick={() => setEditingPlant(plant)} className="mr-2">Edit</button>
              <button onClick={() => handleDeletePlant(plant.id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ManagePlant;
