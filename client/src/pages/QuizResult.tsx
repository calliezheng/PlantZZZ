import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plant } from './Quiz';
import axios from 'axios';

type MatchPackage = {
  items: Plant[];
  score: number;
  correctIds: Set<number>; // Correct this to be a Set of numbers
};

const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const matchPackages = location.state?.matchPackages as MatchPackage[];
  const totalScore = matchPackages?.reduce((acc, matchPkg) => acc + matchPkg.score, 0) ?? 0;
  const userId = localStorage.getItem('user_id');
  const handleTryAnotherQuiz = () => {
    navigate('/quiz'); 
  };

  const sendScoreToBackend = async (userId: string, score: number) => {
    try {
      const url = `http://localhost:3001/quiz/${userId}`; // Adjust URL based on your actual API endpoint
      const response = await axios.post(url, { score });
      console.log('Score updated successfully:', response.data);
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  };

  if (userId) {
    sendScoreToBackend(userId, totalScore);
  } else {
    console.error('User ID is not available');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-5 text-center">Quiz Completed!</h1>
      <button onClick={handleTryAnotherQuiz} className="bg-blue-500 text-white px-6 py-2 rounded shadow-lg hover:bg-blue-600 transition-colors my-4">Try Another Quiz</button>
      <p className="text-lg mb-5 text-center">Your total score is: {totalScore}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchPackages?.map((matchPkg, index) => (
          <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
            <h2 className="text-lg font-bold bg-gray-100 p-2 text-center">Match {index + 1}</h2>
            {matchPkg.items.map((item, itemIndex) => {
              // Determine if the current item ID is in the correctIds set
              const isCorrect = matchPkg.correctIds.has(item.id);
              return (
                <div
                  key={itemIndex}
                  className={`border ${isCorrect ? 'border-green-500' : 'border-red-500'}`}
                >
                  <div className="px-6 py-4">
                    {item.type === 'academicNames' && <p className="text-gray-700 text-base">{item.academic_name}</p>}
                    {item.type === 'dailyNames' && <p className="text-gray-700 text-base">{item.daily_name}</p>}
                    {item.type === 'pictures' && item.Pictures && item.Pictures[0] && (
                      <img
                        className="w-full h-48 object-cover"
                        src={`http://localhost:3001/images/plants/${encodeURIComponent(item.Pictures[0].picture_file_name)}`}
                        alt={item.daily_name || item.academic_name}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <h1 className="text-2xl font-bold mb-5 text-center">Right Answers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matchPackages?.map((matchPkg, index) => (
        <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
            {matchPkg.items
            .filter(item => item.type === 'academicNames')
            .map((item, itemIndex) => (
                <div key={itemIndex} className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{item.academic_name}</div>
                <p className="text-gray-700 text-base">{item.daily_name}</p>
                {item.Pictures && item.Pictures[0] && (
                    <img
                    className="w-full h-48 object-cover"
                    src={`http://localhost:3001/images/plants/${encodeURIComponent(item.Pictures[0].picture_file_name)}`}
                    alt={item.daily_name || item.academic_name}
                    />
                )}
                </div>
            ))}
  </div>
))}

      </div>
    </div>
  );
};

export default QuizResult;
