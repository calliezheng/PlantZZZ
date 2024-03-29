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
    <div>
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
              <label htmlFor="username">Username:</label>
              <Field id="username" name="username" className="w-64 border border-gray-300 p-2 rounded" />
              <ErrorMessage name="username" component="div" />

              <label htmlFor="email">Email:</label>
              <Field id="email" name="email" type="email" className="w-64 border border-gray-300 p-2 rounded" />
              <ErrorMessage name="email" component="div" />

              <button type="submit" disabled={isSubmitting}>
                Save
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <p>Loading...</p>
      )}

      <Link to={`/profile/${id}/password`} className="hover:text-green-600">
        Change Password
      </Link>
    </div>
  );
};

export default Profile;

