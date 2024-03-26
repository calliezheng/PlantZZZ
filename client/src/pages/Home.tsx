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
       <main>
        <div className="flex justify-center items-center space-x-4 p-4">
          <div className="border p-4 w-1/4">
            <Link to="/learn">Learn</Link>
          </div>
          <div className="border p-4 w-1/4">
            <Link to="/quiz">Quiz</Link>
          </div>
        </div>
        {/* Your carousel component goes here */}
      </main>
    </div>
  )
}

export default Home