import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    useEffect(() => {
        axios.get("http://localhost:3001/home").then((response) => {
        console.log(response);
        });
      }, []);

  return (
    <div>
       <h1>PlantZZZ</h1>
    
    </div>
  )
}

export default Home