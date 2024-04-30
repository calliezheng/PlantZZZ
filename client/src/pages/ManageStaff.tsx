import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

interface Staff {
    id?: number;
    username: string;
    email: string
}

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
    <div>
      <h2>Staff List</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {staffs.map(staff => (
                    <tr key={staff.id}>
                        <td>{staff.id}</td>
                        <td>{staff.username}</td>
                        <td>{staff.email}</td>
                        <td><button onClick={() => handleDeleteStaff(staff.id)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>

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
            <Form>
              <Field name="username" type="text" placeholder="Username" />
              <ErrorMessage name="username" component="div" />
              <Field name="email" type="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" />
              <button type="submit" disabled={isSubmitting}>Add Staff Account</button>
              <button
                type="button"
                onClick={() => setIsAdding(false)} 
                disabled={isSubmitting}
              >Cancel</button>
            </Form>
          )}
        </Formik>
      )}
      <button onClick={() => setIsAdding(true)}>Add Staff</button>
    </div>
  )
}

export default ManageStaff
