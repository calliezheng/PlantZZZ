import React, { useState } from 'react';
import { SignIn, SignUp } from './Sign';

interface SignModalProps {
  toggleModal: () => void; // Define the type for the toggleModal function
}

function SignModal({ toggleModal } : SignModalProps) {
  const [isSignUp, setIsSignUp] = useState(true); // true for sign-up form, false for sign-in form
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button
        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded"
        onClick={() => setShowModal(true)}
      >
        Sign In/Sign Up
      </button>

      {showModal ? (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
            <div>
              <button className="float-right" onClick={() => setShowModal(false)}>Close</button>
            </div>
            <div className="py-4 text-lg text-gray-800">
              <h3>{isSignUp ? 'Sign Up' : 'Sign In'}</h3>
            </div>
            <div>
              {isSignUp ? (
                // Sign-Up Form Component
                <SignUp />
              ) : (
                // Sign-In Form Component
                <SignIn />
              )}
            </div>
            <div className="text-center mt-4">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default SignModal;