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

  const handleAddPlant = async (values: Plant, actions: FormikHelpers<Plant>) => {
    try {
      const response = await axios.post('http://localhost:3001/plant', values);
      setPlants([...plants, response.data]);
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
    actions.setSubmitting(false);
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
      <button onClick={() => setIsAdding(true)}>Add New Plant</button>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <div key={plant.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            {plant.Pictures && plant.Pictures[0] && (
              <img className="w-full" src={`../plant picture/${plant.Pictures[0].picture_file_name}`} alt="Plant" />
            )}
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{plant.acadamic_name}</div>
              <p className="text-gray-700 text-base">
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
}

export default ManagePlant;
