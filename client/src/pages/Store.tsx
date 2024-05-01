import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Store() {
  const [scores, setScores] = useState<Score | null>(null); 
  const id = localStorage.getItem('user_id');

  interface Score {
    score: number;
  }

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/store/${id}`); 
        console.log("Scores fetched:", response.data);
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div>
      {scores ? (
        <p>Score: {scores.score}</p>
      ) : (
        <p>Loading scores...</p>
      )}
    </div>
  );
}

export default Store;
