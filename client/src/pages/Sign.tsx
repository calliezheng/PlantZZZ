import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  
  const navigate = useNavigate();
  
  interface FormValues {
    username: string;
    password: string;
  }
  
  const initialValues:FormValues = {
    username:'',
    password:'',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().min(6).max(20).required(),
  });
  
 
  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      const response = await fetch('http://localhost:3001/home/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const responseBody = await response.json();
      if (!response.ok) {
        const errorMessage = responseBody.message || 'Sign In Failed';
        actions.setFieldError('general', errorMessage);
      }
      console.log(responseBody);
      if (responseBody.success) {
        navigate('/dashboard');
      } else {
        actions.setFieldError('general', responseBody.message || 'Sign in failed.');
      }
    } catch (error) {
      actions.setFieldError('general', 'Failed to sign in. Please check your connection and try again.');
  };
};

  return (
    <div className='signInForm'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label>Username</label>
          <Field id="username" name="username" placeholder="Username or Email"/>
          <ErrorMessage name="username" component="span" className="error" />
          
          <label>Password</label>
          <Field id="password" name="password" type="password" placeholder="Password"/>
          <ErrorMessage name="password" component="span" className="error" />
          
          <ErrorMessage name="general" component="span" className="error general-error" />
          
          <button type="submit">Sign In</button>
        </Form>
      </Formik>
    </div>
  )
}

export function SignUp() {
  
  const navigate = useNavigate();
  
  interface FormValues {
    username: string;
    email: string;
    password: string;
  }

  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').max(20, 'Password must not exceed 20 characters').required('Password is required'),
  });

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      const response = await fetch('http://localhost:3001/home/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Sign up Failed');
      }
      const responseBody = await response.json();
      console.log(responseBody);
      if (responseBody.success) { // Assume your API returns { success: true } on successful login
        navigate('/');
      } else {
        // Handle failed sign-in attempt
        actions.setFieldError('general', 'Your username is occupied.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Optionally set form error messages here
      actions.setFieldError('general', 'Failed to sign up. Please check your credentials and try again.');
    }
  };

  return (
    <div className='signUpForm'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" placeholder="Username" />
          <ErrorMessage name="username" component="span" />

          <label htmlFor="email">Email</label>
          <Field id="email" name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="span" />

          <label htmlFor="password">Password</label>
          <Field id="password" name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component="span" />
          
          <button type="submit">Sign Up</button>
        </Form>
      </Formik>
    </div>
  );
}

