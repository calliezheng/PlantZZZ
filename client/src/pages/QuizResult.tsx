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
      <h1 className="text-3xl text-brown font-bold font-poetsen mb-5 text-center">Quiz Completed!</h1>
      <button onClick={handleTryAnotherQuiz} className="bg-green-600 text-white font-opensans px-6 py-2 rounded shadow-lg hover:bg-green-700 transition-colors mb-2">Try Another Quiz</button>
      <p className="text-xl  text-brown-light font-bold font-poetsen mb-5 text-center">Your total score is: {totalScore}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchPackages?.map((matchPkg, index) => (
          <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg bg-beige">
            <h2 className="text-lg text-brown font-bold font-opensans p-2 text-center">Match {index + 1}</h2>
            {matchPkg.items.map((item, itemIndex) => {
              // Determine if the current item ID is in the correctIds set
              const isCorrect = matchPkg.correctIds.has(item.id);
              return (
                <div
                  key={itemIndex}
                  className={`border ${isCorrect ? 'border-green-700 border-4' : 'border-red-700 border-4'}`}
                >
                  <div className="px-6 py-4">
                    {item.type === 'academicNames' && <p className="text-brown-dark font-opensans text-base">{item.academic_name}</p>}
                    {item.type === 'dailyNames' && <p className="text-brown-dark font-opensans text-base">{item.daily_name}</p>}
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
      <h1 className="text-3xl text-beige font-bold font-poetsen mb-5 text-center">Right Answers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matchPackages?.map((matchPkg, index) => (
        <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
            {matchPkg.items
            .filter(item => item.type === 'academicNames')
            .map((item, itemIndex) => (
                <div key={itemIndex} className="px-6 py-4 bg-beige">
                <div className="text-brown-dark font-opensans text-base mb-2">{item.academic_name}</div>
                <p className="text-brown-dark font-opensans text-base mb-4">{item.daily_name}</p>
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
