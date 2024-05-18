import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/profile/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-1/3">
      {user ? (
        <Formik
          initialValues={{
            username: user.username,
            email: user.email,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.put(`http://localhost:3001/profile/${id}`, values);
              setUser(response.data);
              setSubmitting(false);
              alert('Profile update successfully');
              navigate(`/profile/${id}`);
            } catch (error) {
              console.error('Error updating profile:', error);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                  <label htmlFor="username" className="block text-xl font-opensans font-medium text-brown-light">Username:</label>
                  <Field id="username" name="username" className="mt-1 block w-64px px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"/>
                  <ErrorMessage name="username" component="div" />
                  </div>

                  <div className="mb-6">
                  <label htmlFor="email" className="block text-xl font-opensans font-medium text-brown-light">Email:</label>
                  <Field id="email" name="email" type="email" className="mt-1 block w-64px px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg" />
                  <ErrorMessage name="email" component="div" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="block text-xl font-opensans font-medium text-brown-light hover:text-brown">
                    Save
                  </button>
                </Form>
          )}
        </Formik>
      ) : (
        <p>Loading...</p>
      )}

      <Link to={`/profile/${id}/password`} className="block text-xl font-opensans font-medium text-brown-light hover:text-brown">
        Change Password
      </Link>
      </div>
    </div>
  );
};

export default Profile;

