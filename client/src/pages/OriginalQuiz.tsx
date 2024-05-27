// src/components/OriginalQuiz.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//Define the type for Typescript 
//Export the module so that the Quiz Result page can import
export interface Plant {
  id: number;
  academic_name?: string;
  daily_name?: string;
  Pictures?: Picture[];
  location: 'academicNames' | 'dailyNames' | 'pictures' | 'matchBox';
  type: 'academicNames' | 'dailyNames' | 'pictures';
}

export interface Picture {
  id: number;
  picture_file_name: string;
}

export interface Answer {
  name: string;
  correct: boolean;
}

const OriginalQuiz: React.FC = () => {
  const [quizData, setQuizData] = useState<Plant[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState<number>(0);
  const [questions, setQuestions] = useState<{ question: Plant; answers: Answer[] }[]>([]);
  const [answerRecords, setAnswerRecords] = useState<{ question: Plant; selectedAnswers: Answer[]; allOptions: Answer[] }[]>([]);
  const navigate = useNavigate();

  // Fetch plant data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get<Plant[]>('http://localhost:3001/learn');
        console.log('response.data', response.data);
        const randomPlants = shuffleArray(response.data).slice(0, 10);
        setQuizData(randomPlants);
        generateQuestions(randomPlants, response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  // Randomize the order of elements
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  //Generate questions
  const generateQuestions = (selectedPlants: Plant[], allPlants: Plant[]) => {
    const generatedQuestions = selectedPlants.map(plant => {
      // Decide randomly if there should be one or two correct answers
      const hasTwoCorrectAnswers = Math.random() > 0.5;

      const correctAnswers: Answer[] = [
        { name: plant.academic_name || '', correct: true },
        { name: plant.daily_name || '', correct: true }
      ];

      // Use other plants' names to be the wrong answers
      const otherPlants = allPlants.filter(p => p.id !== plant.id);
      const wrongAnswers: Answer[] = [];

      while (wrongAnswers.length < 3) {
        const randomPlant = otherPlants[Math.floor(Math.random() * otherPlants.length)];
        const potentialWrongAnswers = [
          { name: randomPlant.academic_name || '', correct: false },
          { name: randomPlant.daily_name || '', correct: false }
        ];

        for (const answer of potentialWrongAnswers) {
          if (
            answer.name &&
            !correctAnswers.some(ca => ca.name === answer.name) &&
            !wrongAnswers.some(wa => wa.name === answer.name)
          ) {
            wrongAnswers.push(answer);
            if (wrongAnswers.length >= 3) break;
          }
        }
      }

      // Select only one correct answer if hasTwoCorrectAnswers is false
      const selectedCorrectAnswers = hasTwoCorrectAnswers ? correctAnswers : [correctAnswers[Math.floor(Math.random() * correctAnswers.length)]];

      return { question: plant, answers: shuffleArray([...selectedCorrectAnswers, ...wrongAnswers.slice(0, 4 - selectedCorrectAnswers.length)]) };
    });

    setQuestions(generatedQuestions);
  };

  // Click to change the status of the answer (chosen or not chosen)
  const handleAnswerClick = (answer: Answer) => {
    setSelectedAnswers(prev => {
      if (prev.some(a => a.name === answer.name)) {
        return prev.filter(a => a.name !== answer.name);
      } else if (prev.length < 2) {
        return [...prev, answer];
      } else {
        return prev;
      }
    });
  };

  //Go to the next question
  const handleNextQuestion = () => {
    let currentScore = 0;
    const correctAnswersCount = selectedAnswers.filter(answer => answer.correct).length;
    const wrongAnswersCount = selectedAnswers.length - correctAnswersCount;

    if (correctAnswersCount === 2 && wrongAnswersCount === 0) {
      currentScore = 5;
    } else if (correctAnswersCount === 1 && wrongAnswersCount === 0) {
      currentScore = 3;
    } else if (correctAnswersCount === 1 && wrongAnswersCount === 1) {
      currentScore = 2;
    } else if (correctAnswersCount === 1 && selectedAnswers.length === 1) {
      currentScore = 5;
    } else if (correctAnswersCount === 1 && selectedAnswers.length === 2) {
      currentScore = 2;
    }
    
    setScore(prev => prev + currentScore);
    setAnswerRecords(prev => [
      ...prev,
      {
        question: questions[currentQuestion].question,
        selectedAnswers,
        allOptions: questions[currentQuestion].answers
      }
    ]);

    if (currentQuestion + 1 < questions.length) {
      setSelectedAnswers([]);
      setCurrentQuestion(prev => prev + 1);
    } else {
      navigate('/originalquizresult', {
        state: {
          score: score + currentScore,
          answerRecords: [
            ...answerRecords,
            {
              question: questions[currentQuestion].question,
              selectedAnswers,
              allOptions: questions[currentQuestion].answers
            }
          ]
        }
      });
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  // Create for easily use in 'return'
  const { question, answers } = questions[currentQuestion];
  const imageUrl = question.Pictures && question.Pictures[0]
    ? `http://localhost:3001/images/plants/${encodeURIComponent(question.Pictures[0].picture_file_name)}`
    : '';

  // allow users can quit the quiz in the middle
  const quitQuiz = () => {
    if (window.confirm('Are you sure you want to quit the quiz?')) {
      navigate('/choosequiz'); 
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={quitQuiz} className="bg-red-600 text-white font-opensans px-6 py-2 rounded shadow-lg hover:bg-red-700 transition-colors">Quit</button>
      <div className="bg-beige rounded-lg shadow-lg p-6 m-4 max-w-md w-full relative">
        <img src={imageUrl} alt={question.id.toString()} className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 text-sm">
          {currentQuestion + 1}/10
        </div>
        <div className="grid grid-cols-1 gap-4">
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              className={`py-2 px-4 rounded-lg ${selectedAnswers.some(a => a.name === answer.name) ? 'bg-brown-dark' : 'bg-brown hover:bg-brown-dark'} text-white font-bold`}
            >
              {answer.name}
            </button>
          ))}
        </div>
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswers.length === 0}
            className={`mt-4 px-6 py-2 rounded shadow-lg font-opensans font-bold transition-colors ${
              selectedAnswers.length === 0
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {currentQuestion + 1 === questions.length ? 'Show Results' : 'Next'}
          </button>
      </div>
    </div>
  );
};

export default OriginalQuiz;
