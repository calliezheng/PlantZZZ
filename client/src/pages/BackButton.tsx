import React from 'react'
import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();
  return (
    <div className="absolute top-5 right-5 m-4">
        <button onClick={() => navigate(-1)} className="bg-brown text-white font-bold font-opensans px-6 py-2 rounded shadow-lg hover:bg-brown transition-colors items-start">
            back
        </button>
    </div>
  )
}

export default BackButton
