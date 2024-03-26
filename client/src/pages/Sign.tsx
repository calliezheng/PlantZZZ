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
    general?: string; // This line extends the FormikErrors type
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
        localStorage.setItem('user_id', responseBody.id);
        localStorage.setItem('username', responseBody.username);
        console.log(responseBody.username)
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
    <div className='signInForm'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ errors, touched }) => (
        <Form>
          <label>Username</label>
          <Field id="username" name="username" placeholder="Username or Email"/>
          <ErrorMessage name="username" component="span" className="error" />
          
          <label>Password</label>
          <Field id="password" name="password" type="password" placeholder="Password"/>
          <ErrorMessage name="password" component="span" className="error" />
          
          {((errors as FormikErrorValues).general) && (
            <div className="error">{(errors as FormikErrorValues).general}</div>
          )}
          
          <button type="submit">Sign In</button>
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

