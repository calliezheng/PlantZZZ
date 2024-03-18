import React from 'react';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

function Sign() {
  
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
    <div className='signUpForm'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label>Username</label>
          <Field id="username" name="username" placeholder="Username or Email"/>
          <label>Password</label>
          <Field id="password" name="password" placeholder="Password"/>
          <button>Submit</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Sign;
