import React from 'react';
import axios from "axios";
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        axios.get("http://localhost:3001/home").then((response) => {
        console.log(response);
        });
      }, []);
     
  return (
    <div>
      
    </div>
  )
}

export default Home