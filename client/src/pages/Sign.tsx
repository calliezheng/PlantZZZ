import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikErrors} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface SignInProps {
  toggleModal: () => void;
  authenticateUser: (isAuth: boolean) => void;
}

export function SignIn({ toggleModal, authenticateUser }: SignInProps ) {
  
  const navigate = useNavigate();
  
  interface FormValues {
    username: string;
    password: string;
  }
  
  interface FormikErrorValues extends FormikErrors<FormValues> {
    general?: string;
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
        localStorage.setItem('user_id', responseBody.user_id);
        localStorage.setItem('username', responseBody.username);
        localStorage.setItem('user_type', responseBody.user_type);
        navigate('/');
        toggleModal();
        authenticateUser(true);
      } else {
        actions.setFieldError('general', responseBody.message || 'Sign in failed.');
      }
    } catch (error) {
      actions.setFieldError('general', 'Failed to sign in. Please check your connection and try again.');
  };
};

  return (
    <div className='signInForm max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ errors, touched }) => (
        <Form className="space-y-6">
          <label htmlFor="username" className="block text-xl font-medium font-opensans text-green-700">Username</label>
          <Field id="username" name="username" placeholder="Username or Email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"
/>
          <ErrorMessage name="username" component="span" className="error text-red-500 text-base italic" />
          
          <label htmlFor="password" className="block text-xl font-medium font-opensans text-green-700">Password</label>
          <Field id="password" name="password" type="password" placeholder="Password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"
/>
          <ErrorMessage name="password" component="span" className="error text-red-500 text-base italic" />
          
          {((errors as FormikErrorValues).general) && (
            <div className="error text-red-500 text-xs italic">{(errors as FormikErrorValues).general}</div>
          )}
          
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium font-opensans text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign In</button>
        </Form>
        )}
      </Formik>
    </div>
  )
}

interface SignUpProps {
  toggleModal: () => void;
}

export function SignUp({ toggleModal }: SignUpProps) {
  
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
        toggleModal();
        toast.success('Sign up successful!');
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
    <div className='signUpForm max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className="space-y-6">
          <label htmlFor="username" className="block text-xl font-medium font-opensans text-green-700">Username</label>
          <Field id="username" name="username" placeholder="Username" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"
/>
          <ErrorMessage name="username" component="span" className="error text-red-500 text-base italic"/>

          <label htmlFor="email" className="block text-xl font-medium font-opensans text-green-700">Email</label>
          <Field id="email" name="email" type="email" placeholder="Email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"
/>
          <ErrorMessage name="email" component="span" className="error text-red-500 text-base italic"/>

          <label htmlFor="password" className="block text-xl font-medium font-opensans text-green-700">Password</label>
          <Field id="password" name="password" type="password" placeholder="Password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-lg"
/>
          <ErrorMessage name="password" component="span" className="error text-red-500 text-base italic"/>
          
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium font-opensans text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-green-500">Sign Up</button>
        </Form>
      </Formik>
    </div>
  );
}

