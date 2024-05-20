// src/components/Results.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plant, Answer } from './OriginalQuiz';

interface LocationState {
  score: number;
  answerRecords: { question: Plant; selectedAnswers: Answer[]; allOptions: Answer[] }[];
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { score, answerRecords } = state;
  const handleTryAnotherQuiz = () => {
    navigate('/originalquiz'); 
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-white">
    <h2 className="text-4xl font-bold font-poetsen mb-4 bg-green-700">Quiz Results</h2>
    <div className="flex">
    <p className="text-2xl mb-4 font-bold font-opensans bg-green-700 mr-8">Your Score: {score}</p>
    <button onClick={handleTryAnotherQuiz} className="bg-brown-light text-white font-bold font-opensans px-6 py-2 rounded shadow-lg hover:bg-brown transition-colors mb-2">Try Another Quiz</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {answerRecords.map((record, index) => (
            <div key={index} className="mb-8 bg-white rounded-lg shadow-lg p-6 m-4 max-w-md w-full relative">
                <h3 className="text-lg text-brown font-bold font-opensans mb-2">Question {index + 1}</h3>
                <img
                src={`http://localhost:3001/images/plants/${encodeURIComponent(record.question.Pictures?.[0].picture_file_name ?? '')}`}
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
