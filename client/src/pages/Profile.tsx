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
    <div className="flex items-center justify-center pt-36">
      <div className="bg-beige p-10 rounded-lg shadow-lg max-w-md w-1/3">
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
                  <label htmlFor="username" className="block text-xl text-left font-opensans font-medium text-brown">Username:</label>
                  <Field id="username" name="username" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"/>
                  <ErrorMessage name="username" component="div" className="error text-red-500 text-base italic"/>
                  </div>

                  <div className="mb-6">
                  <label htmlFor="email" className="block text-xl text-left font-opensans font-medium text-brown">Email:</label>
                  <Field id="email" name="email" type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg" />
                  <ErrorMessage name="email" component="div" className="error text-red-500 text-base italic"/>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button type="submit" disabled={isSubmitting} className="text-xl font-opensans font-medium text-green-700 hover:text-green-800 rounded py-2 px-4">
                      Save
                    </button>
                    <Link to={`/dashboard/profile/${id}/password`} className="text-xl font-opensans font-medium text-brown hover:text-brown-dark">
                    Change Password
                  </Link>
                </div>
                </Form>
          )}
        </Formik>
      ) : (
        <p>Loading...</p>
      )}
      </div>
    </div>
  );
};

export default Profile;

