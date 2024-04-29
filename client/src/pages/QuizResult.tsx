import React from 'react';
import { useLocation } from 'react-router-dom';
import { Plant } from './Quiz'; 

type MatchPackage = {
  items: Plant[];
  score: number;
  isCorrect: boolean;
};

const QuizResult: React.FC = () => {
  // Correctly get the state from the location, assuming it's structured with matchPackages
  const location = useLocation();
  const matchPackages = location.state?.matchPackages as MatchPackage[];

  // Calculate total score
  const totalScore = matchPackages?.reduce((acc, matchPkg) => acc + matchPkg.score, 0) ?? 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-5 text-center">Quiz Completed!</h1>
      <p className="text-lg mb-5 text-center">Your total score is: {totalScore}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchPackages?.map((matchPkg, index) => (
          <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
            <h2 className="text-lg font-bold bg-gray-100 p-2 text-center">Match {index + 1}</h2>
            {matchPkg.items.map((item, itemIndex) => (
              <div key={itemIndex} className={`border ${matchPkg.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                {item.Pictures && item.Pictures[0] && (
                  <img
                    className="w-full h-48 object-cover"
                    src={`http://localhost:3001/images/plants/${encodeURIComponent(item.Pictures[0].picture_file_name)}`}
                    alt={item.daily_name}
                  />
                )}
                <div className="px-6 py-4">
                  <p className="text-gray-700 text-base">{item.academic_name}</p>
                  <p className="text-gray-700 text-base">{item.daily_name}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResult;
