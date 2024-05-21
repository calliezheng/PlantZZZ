import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import BackButton from './BackButton';

interface Plant {
  id?: number;
  academic_name: string;
  daily_name: string;
  Pictures?: Picture[];
}

interface Picture {
  id: number;
  picture_file_name: string;
}

const validationSchema = Yup.object().shape({
  academic_name: Yup.string()
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
    const firstLetter = plant.academic_name[0].toUpperCase();
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
    formData.append('academic_name', values.academic_name);
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
    formData.append('academic_name', values.academic_name);
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
      <BackButton />
      <div>
        {letterGroups.map((group) => (
          <button
            key={group}
            onClick={() => handleLetterClick(group)}
            className={`${
              filter === group ? 'font-bold bg-green-600' : 'bg-beige'
            } text-lg font-poetsen text-brown px-4 py-2 rounded-lg shadow hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out mb-4`}
          >
            {group}
          </button>
        ))}
      </div>
      <button onClick={() => setIsAdding(true)} className="text-lg leading-6 font-medium font-poetsen text-beige bg-brown hover:bg-brown-dark focus:outline-none focus:ring-2 focus:ring-brown-dark focus:ring-opacity-50 rounded-lg shadow-lg transition duration-150 ease-in-out px-6 py-2 my-4">Add New Plant</button>
      {isAdding && (
        <Formik initialValues={{ academic_name: '', daily_name: ''}} validationSchema={validationSchema} onSubmit={handleAddPlant}>
          {({ isSubmitting }) => (
            <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${isAdding ? '' : 'hidden'}`}>
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="block text-4xl font-amatic font-medium text-green-700 text-center">Add New Plant</h3>
                  <Form>
                    <div className="mt-2">
                      <label htmlFor="academic_name" className="block text-lg text-left font-opensans font-medium text-green-700">Academic Name</label>
                      <Field name="academic_name" type="text" placeholder="Academic Name" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                      <ErrorMessage name="academic_name" component="div" className="error text-red-500 text-base italic"/>
                    </div>

                    <div className="mt-2">
                      <label htmlFor="daily_name" className="block text-lg text-left font-opensans font-medium text-green-700">Daily Name</label>
                      <Field name="daily_name" type="text" placeholder="Daily Name" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                      <ErrorMessage name="daily_name" component="div" className="error text-red-500 text-base italic"/>
                    </div>

                    <div className="mt-2">
                      <label htmlFor="picture" className="block text-lg text-left font-opensans font-medium text-green-700">Picture</label>
                      <input id="picture" name="picture" type="file" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                    </div>

                    <div className="items-center px-4 py-3">
                      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">Add Plant</button>
                      <button type="button" onClick={() => setIsAdding(false)} disabled={isSubmitting} className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                    </div>
                  </Form>
                  </div>
                </div>
              </div>
                )}
              </Formik>
            )}

        
            {editingPlant && (
              <Formik
                initialValues={{ academic_name: editingPlant.academic_name, daily_name: editingPlant.daily_name,}}
                validationSchema={validationSchema}
                onSubmit={handleUpdatePlant}
              >
                {({ isSubmitting }) => (
                  <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${ editingPlant? '' : 'hidden'}`}>
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                      <div className="mt-3 text-center">
                        <h3 className="block text-4xl font-amatic font-medium text-green-700 text-center">Edit Plant</h3>
                        <Form>
                          <div className="mt-2">
                            <label htmlFor="academic_name" className="block text-lg text-left font-opensans font-medium text-green-700">Academic Name</label>
                            <Field name="academic_name" type="text" placeholder="Academic Name" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                            <ErrorMessage name="academic_name" component="div" className="error text-red-500 text-base italic"/>
                          </div>
                          <div className="mt-2">
                            <label htmlFor="daily_name" className="block text-lg text-left font-opensans font-medium text-green-700">Daily Name</label>
                            <Field name="daily_name" type="text" placeholder="Daily Name" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                            <ErrorMessage name="daily_name" component="div" className="error text-red-500 text-base italic"/>
                          </div>

                          <div className="mt-2">
                            <label htmlFor="picture" className="block text-lg text-left font-opensans font-medium text-green-700">Picture</label>
                            <input id="picture" name="picture" type="file" onChange={(e) => handleFileChange(e, editingPlant?.id)} className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                          </div>

                          <div className="items-center px-4 py-3">
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">Update Plant</button>
                            <button type="button" onClick={() => setEditingPlant(null)} className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                )}
              </Formik>
            )}
 
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
                  <div className="px-6 py-4 bg-beige">
                    <div className="font-bold font-opensans text-xl text-brown mb-2">{plant.academic_name}</div>
                    <p className="font-bold font-opensans text-brown-light text-lg mb-4">
                      {plant.daily_name}
                    </p>
                    <button onClick={() => setEditingPlant(plant)} className="mr-4 font-poetsen text-green-600 text-lg">Edit</button>
                    <button onClick={() => handleDeletePlant(plant.id)} className="font-poetsen text-red-600 text-lg">Delete</button>
                  </div>
                </div>
              ))}
        </div>
    </div>
  );
}

export default ManagePlant;
