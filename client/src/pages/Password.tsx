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
          <label>Current Password: </label>
            <Field type="password" name="currentPassword" />
            <ErrorMessage name="currentPassword" component="div" />
         

          <label>New Password:</label>
            <Field type="password" name="newPassword" />
            <ErrorMessage name="newPassword" component="div" />
          

          <label>Confirm New Password:</label>
            <Field type="password" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" />
          

          <button type="submit" disabled={isSubmitting}>
            Change Password
          </button>
          <button type="button" onClick={() => navigate(`/profile/${id}`)}>
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
