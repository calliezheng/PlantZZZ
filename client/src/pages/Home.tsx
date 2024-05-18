import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Home() {
    useEffect(() => {
        axios.get("http://localhost:3001/home").then((response) => {
        console.log(response);
        });
      }, []);

  return (
    <div className="container mx-auto">
       <main className="flex flex-col justify-start items-center min-h-screen pt-48">
        <div className="flex justify-center items-center space-x-72 p-4">
          <div className="flex justify-center items-center w-100 h-72 border-4 border-brown bg-beige p-8">
            <Link to="/learn" className="text-8xl text-brown hover:text-brown-dark font-amatic font-bold">Learn</Link>
          </div>
          <div className="flex justify-center items-center w-100 h-72 border-4 border-brown bg-beige p-8">
            <Link to="/quiz" className="text-8xl text-brown hover:text-brown-dark font-amatic font-bold">Quiz</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home