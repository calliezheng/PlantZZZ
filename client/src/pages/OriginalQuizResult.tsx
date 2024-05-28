// src/components/Results.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plant, Answer } from './OriginalQuiz';
import axios from 'axios';

//Define the type for Typescript 
interface LocationState {
  score: number;
  answerRecords: { question: Plant; selectedAnswers: Answer[]; allOptions: Answer[] }[];
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('user_id');
  const state = location.state as LocationState;
  const { score, answerRecords } = state;
  const handleTryAnotherQuiz = () => {
    navigate('/originalquiz'); 
  };

const sendScoreToBackend = async (userId: string, score: number) => {
  try {
    const url = `http://localhost:3001/quiz/${userId}`; 
    const response = await axios.post(url, { score });
    console.log('Score updated successfully:', response.data);
  } catch (error) {
    console.error('Failed to update score:', error);
  }
};

if (userId) {
  sendScoreToBackend(userId, score);
} else {
  console.error('User ID is not available');
}


const quitQuiz = () => {
  if (window.confirm('Are you sure you want to quit the quiz?')) {
    navigate('/choosequiz'); 
  }
};

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-white">
    <h1 className="text-3xl text-beige bg-brown font-bold font-poetsen mb-5 text-center">Quiz Completed!</h1>
    <div className="flex">
    <button onClick={quitQuiz} className="bg-green-600 text-white font-opensans px-6 py-2 rounded shadow-lg hover:bg-green-700 transition-colors mr-8 mb-4">Done</button>
    <button onClick={handleTryAnotherQuiz} className="bg-green-600 text-white font-opensans px-6 py-2 rounded shadow-lg hover:bg-green-700 transition-colors mb-4">Try Another Quiz</button>
    </div>
    <p className="text-2xl mb-4 font-bold font-poetsen bg-brown mr-8">Your total score is: {score}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {answerRecords.map((record, index) => (
            <div key={index} className="mb-8 bg-white rounded-lg shadow-lg p-6 m-4 max-w-md w-full relative">
                <h3 className="text-lg text-brown font-bold font-opensans mb-2">Question {index + 1}</h3>
                <img
                src={`http://localhost:3001/images/plants/${encodeURIComponent(record.question.picture ?? '')}`}
                alt={record.question.id.toString()}
                className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="grid grid-cols-1 gap-4">
                {record.allOptions.map((option, i) => (
                    <div
                    key={i}
                    className={`py-2 px-4 rounded-lg text-white font-opensans font-bold ${
                        option.correct
                        ? 'bg-green-500'
                        : record.selectedAnswers.some(a => a.name === option.name)
                        ? 'border-red-500 border-4 bg-brown'
                        : 'bg-brown'
                    } ${
                        record.selectedAnswers.some(a => a.name === option.name)
                        ? option.correct
                            ? 'border-green-700 border-4'
                            : 'border-red-500 border-4'
                        : ''
                    }`}
                    >
                    {option.name}
                    </div>
                    ))}
                </div>
            </div>
            ))}
        </div>
    </div>
  );
};

export default Results;
