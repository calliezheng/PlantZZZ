import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password cannot exceed 20 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
      .required('Confirming new password is required'),
  });

const Password = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
 
  return (
    <div className="flex items-center justify-center pt-36">
      <div className="bg-beige p-10 rounded-lg shadow-lg max-w-md w-1/3">
        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Perform the password update
              await axios.put(`http://localhost:3001/profile/${id}/password`, {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
              });
              alert('Password changed successfully');
              navigate(`/profile/${id}`); // Navigate back to the profile page
            } catch (error) {
              console.error('Error changing password:', error);
              alert('Failed to change password');
            }
            setSubmitting(false);
          }}
          >

          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-xl text-left font-opensans font-medium text-brown">Current Password: </label>
                <Field type="password" name="currentPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"/>
                <ErrorMessage name="currentPassword" component="div" className="error text-red-500 text-base italic"/>
              </div>

                <label htmlFor="newPassword" className="block text-xl text-left font-opensans font-medium text-brown">New Password:</label>
                <Field type="password" name="newPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"/>
                <ErrorMessage name="newPassword" component="div" className="error text-red-500 text-base italic"/>
              

                <label htmlFor="confirmPassword" className="block text-xl text-left font-opensans font-medium text-brown">Confirm New Password:</label>
                <Field type="password" name="confirmPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"/>
                <ErrorMessage name="confirmPassword" component="div" className="error text-red-500 text-base italic"/>
              

              <button type="submit" disabled={isSubmitting} className="text-xl font-opensans font-medium text-green-700 hover:text-green-800 rounded py-2 px-4">
                Change Password
              </button>
              <button type="button" onClick={() => navigate(`/dashboard/profile/${id}`)} className="text-xl font-opensans font-medium text-red-700 hover:text-green-800 rounded py-2 px-4">
                Cancel
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Password;
