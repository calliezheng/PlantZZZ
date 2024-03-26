import React from 'react';
import { SignIn, SignUp } from './Sign';

interface SignModalProps {
  showModal: boolean; // This indicates if the modal should be shown or not
  toggleModal: () => void; // The function to call when we want to toggle the modal
  isSignUp: boolean; // Indicates whether to show the sign-up form or the sign-in form
  toggleForm: () => void; // Function to toggle between sign up and sign in
  authenticateUser: (isAuth: boolean) => void;
}

const SignModal: React.FC<SignModalProps> = ({ showModal, toggleModal, isSignUp, toggleForm, authenticateUser }) => {
  return showModal ? (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <div>
          <button className="float-right" onClick={toggleModal}>
            Close
          </button>
        </div>
        <div className="py-4 text-lg text-gray-800">
          <h3>{isSignUp ? 'Sign Up' : 'Sign In'}</h3>
        </div>
        <div>
          {isSignUp ? (
            // Sign-Up Form Component
            <SignUp toggleModal={toggleModal}/>
          ) : (
            // Sign-In Form Component
            <SignIn toggleModal={toggleModal} authenticateUser={authenticateUser}/>
          )}
        </div>
        <div className="text-center mt-4">
          <button className="text-blue-500 hover:text-blue-700" onClick={toggleForm}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SignModal;
