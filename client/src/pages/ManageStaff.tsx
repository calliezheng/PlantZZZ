import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import BackButton from './BackButton';

//Define the type for Typescript 
interface Staff {
    id?: number;
    username: string;
    email: string
}

// Create Validation by yup
const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required'),
      email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

function ManageStaff() {
    const id = localStorage.getItem('user_id');
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchStaffs = async () => {
            try {
            const response = await axios.get(`http://localhost:3001/staff/${id}`);
            setStaffs(response.data);
            } catch (error) {
            console.error('Error fetching staff data:', error);
            }
        };

        fetchStaffs();
        }, []);

    // Add staff
    const handleAddStaff = async (values: Staff, actions: FormikHelpers<Staff>) => {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('email', values.email);

        try {
            const response = await axios.post("http://localhost:3001/staff", formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            });
            setStaffs(currentStaffs => [...currentStaffs, response.data]);
            setIsAdding(false);
            alert('New staff added successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error adding staff:', error);
        }
        actions.setSubmitting(false);
        };

    // Delete staff
    const handleDeleteStaff = async (id?: number) => {
        if (id) {
            try {
            const response = await axios.patch(`http://localhost:3001/staff/deactivate/${id}`); 
            if(response.status === 204) {
                alert('Staff deleted successfully');
                setStaffs(currentStaffs => currentStaffs.filter(p => p.id !== id));
            }
            } catch (error) {
            console.error('Error deactivating staff:', error);
            }
        }
    };

  return (
    <div className="flex items-center justify-center pt-36">
      <BackButton />

      {/* Staff list */}
      <div className="bg-beige p-10 rounded-lg shadow-lg w-1/3 mx-auto">
      <h2 className="block text-3xl text-center font-poetsen font-bold text-brown">Staff List</h2>
        <table className="w-full text-left">
            <thead className="text-brown-light text-lg font-opensans uppercase">
                <tr>
                    <th className="px-5 py-3 text-left tracking-wider">ID</th>
                    <th className="px-5 py-3 text-left tracking-wider">Username</th>
                    <th className="px-5 py-3 text-left tracking-wider">Email</th>
                </tr>
            </thead>
            <tbody className="text-brown-light text-base font-opensans">
                {staffs.map(staff => (
                    <tr key={staff.id}>
                        <td className="px-5 py-5">{staff.id}</td>
                        <td className="px-5 py-5">{staff.username}</td>
                        <td className="px-5 py-5">{staff.email}</td>
                        <td className="px-5 py-5">
                          <button onClick={() => handleDeleteStaff(staff.id)} className="text-red-500 hover:text-red-700 font-bold transition duration-300 ease-in-out rounded py-1 px-3">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
          <button onClick={() => setIsAdding(true)} className="text-lg font-opensans font-bold text-green-700 hover:text-green-800 rounded py-2 px-4">Add Staff</button>
        </div>

        {/* Add staff form */}
        {isAdding && (
        <Formik
          initialValues={{
            username: '',
            email: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddStaff}
        >
          {({ isSubmitting }) => (
            <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${ isAdding? '' : 'hidden'}`}>
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="block text-4xl font-amatic font-medium text-green-700 text-center">Add New Staff</h3>
                  <Form>
                  <div className="mt-2">
                    <label htmlFor="username" className="block text-lg text-left font-opensans font-medium text-green-700">Username</label>
                    <Field name="username" type="text" placeholder="Username" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                    <ErrorMessage name="username" component="div" className="error text-red-500 text-base italic"/>
                  </div>
                  <div className="mt-2">
                    <label htmlFor="email" className="block text-lg text-left font-opensans font-medium text-green-700">Email</label>
                    <Field name="email" type="email" placeholder="Email" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                    <ErrorMessage name="email" component="div" className="error text-red-500 text-base italic"/>
                  </div>

                  <div className="items-center px-4 py-3">
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">Add Staff Account</button>
                    <button type="button" onClick={() => setIsAdding(false)} disabled={isSubmitting} className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                  </div>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </Formik>
      )}
    </div>
  )
}

export default ManageStaff
