import React from 'react';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

export function SignIn() {
  
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
  
  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className='signInForm'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label>Username</label>
          <Field id="username" name="username" placeholder="Username or Email"/>
          <ErrorMessage name="username" component="div" />
          
          <label>Password</label>
          <Field id="password" name="password" type="password" placeholder="Password"/>
          <ErrorMessage name="password" component="div" />
          
          <button type="submit">Sign In</button>
        </Form>
      </Formik>
    </div>
  )
}

export function SignUp() {
  
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

   const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className='signUpForm'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" placeholder="Username" />
          <ErrorMessage name="username" component="div" />

          <label htmlFor="email">Email</label>
          <Field id="email" name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />

          <label htmlFor="password">Password</label>
          <Field id="password" name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
          
          <button type="submit">Sign Up</button>
        </Form>
      </Formik>
    </div>
  );
}
