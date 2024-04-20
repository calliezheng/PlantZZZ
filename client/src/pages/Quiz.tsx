import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable} from '../helpers/StrictModeDroppable'; //Solve the problem between React 18 and react-beautiful-dnd Droppable 

interface Plant {
  id: number;
  academic_name: string;
  daily_name: string;
  Pictures?: Picture[];
}

interface Picture {
  id: number;
  picture_file_name: string;
}

interface MatchAttempt {
  academicName: string;
  dailyName: string;
  picture: string;
}

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

const Quiz = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [academicNames, setAcademicNames] = useState<Plant[]>([]);
  const [dailyNames, setDailyNames] = useState<Plant[]>([]);
  const [pictures, setPictures] = useState<Plant[]>([]);
  const [matches, setMatches] = useState<MatchAttempt[]>([]); // An array to store matches
  const [currentMatch, setCurrentMatch] = useState({ academicName: '', dailyName: '', picture: '' });
  const [matchedAcademicNames, setMatchedAcademicNames] = useState<Plant[]>([]);
  const [matchedDailyNames, setMatchedDailyNames] = useState<Plant[]>([]);
  const [matchedPictures, setMatchedPictures] = useState<Plant[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchPlants = async () => {
      // Replace with your API call
      const response = await axios.get(`http://localhost:3001/quiz`);
      const shuffledPlants = shuffleArray(response.data);
      setPlants(shuffledPlants);
      setAcademicNames(shuffledPlants);
      setDailyNames(shuffleArray([...shuffledPlants])); // Shuffle again for randomness
      setPictures(shuffleArray([...shuffledPlants])); // Shuffle again for randomness
    };

    fetchPlants();
  }, []);

  // Handle drag and drop logic here
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
  
    // Dropped outside the list
    if (!destination) {
      return;
    }
  
    // Moving within the same list (reordering)
    if (source.droppableId === destination.droppableId) {
      // Logic for reordering within the same list can go here
    } 
    // Moving from original list to match box
    else if (destination.droppableId === "matchBox") {
      // Depending on the source, add to the matched items
      if (source.droppableId === "academicNames") {
        const academicName = academicNames[source.index];
        setMatchedAcademicNames((prev) => [...prev, academicName]);
        setAcademicNames((prev) => prev.filter((_, idx) => idx !== source.index));
      } else if (source.droppableId === "dailyNames") {
        const dailyName = dailyNames[source.index];
        setMatchedDailyNames((prev) => [...prev, dailyName]);
        setDailyNames((prev) => prev.filter((_, idx) => idx !== source.index));
      } else if (source.droppableId === "pictures") {
        const picture = pictures[source.index];
        setMatchedPictures((prev) => [...prev, picture]);
        setPictures((prev) => prev.filter((_, idx) => idx !== source.index));
      }
    } 
    // Moving from match box back to original list
    else {
      if (source.droppableId === "matchBox") {
        if (destination.droppableId === "academicNames") {
          const academicName = matchedAcademicNames[source.index];
          setAcademicNames((prev) => [...prev, academicName]);
          setMatchedAcademicNames((prev) => prev.filter((_, idx) => idx !== source.index));
        } else if (destination.droppableId === "dailyNames") {
          const dailyName = matchedDailyNames[source.index];
          setDailyNames((prev) => [...prev, dailyName]);
          setMatchedDailyNames((prev) => prev.filter((_, idx) => idx !== source.index));
        } else if (destination.droppableId === "pictures") {
          const picture = matchedPictures[source.index];
          setPictures((prev) => [...prev, picture]);
          setMatchedPictures((prev) => prev.filter((_, idx) => idx !== source.index));
        }
      }
    }
  };
  

  const confirmMatch = () => {
    // Check if the current match is correct, partially correct, or incorrect
    // Update the matches and score state accordingly

    // Here's a mockup of the logic; you will need to replace it with actual checking logic
    const isMatchCorrect = true; // Replace this with actual condition check
    if (isMatchCorrect) {
      setScore((prevScore) => prevScore + 3);
    }

    // Add the current match to the list of attempts and reset for the next match
    setMatches((prevMatches) => [...prevMatches, currentMatch]);
    setCurrentMatch({ academicName: '', dailyName: '', picture: '' });

    // If it was the 10th match, calculate and show results
    if (matches.length === 9) {
      // Show results and score
      alert(`Quiz completed! Your score is: ${score}`);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row md:justify-center p-5 gap-4">
        {/* Droppable container for academic names */}
        <Droppable droppableId="academicNames">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-64 h-96 bg-gray-100 p-2 rounded overflow-auto"
            >
              {academicNames.map((plant, index) => (
                <Draggable key={plant.id} draggableId={`academic-${plant.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
                    >
                      {plant.academic_name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Droppable container for daily names */}
        <Droppable droppableId="dailyNames">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-64 h-96 bg-gray-100 p-2 rounded overflow-auto"
            >
              {dailyNames.map((plant, index) => (
                <Draggable key={plant.id} draggableId={`daily-${plant.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
                    >
                      {plant.daily_name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Droppable container for pictures */}
        <Droppable droppableId="pictures">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-64 h-96 bg-gray-100 p-2 rounded overflow-auto"
          >
            {pictures.map((plant, index) => (
              <Draggable key={plant.id} draggableId={`picture-${plant.id}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
                  >
                        {plant.Pictures && plant.Pictures[0] && (
                  <img
                    className="w-full"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    src={plant.Pictures.length > 0 ? `http://localhost:3001/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}` : '/images/plants/picture_is_missing.png'}
                    alt={plant.daily_name}
                  />
                )}
                  </div>
                )}
          </Draggable>
      ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>

<Droppable droppableId="matchBox">
  {(provided) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="w-64 h-96 bg-gray-300 p-2 rounded"
    >
      {/* Placeholder or items that are dragged into the match box */}
      <div className="text-center font-bold">Match Box</div>
      {matchedAcademicNames.map((plant, index) => (
        <div key={plant.id} className="p-2 mb-2 bg-white rounded shadow">
          {plant.academic_name}
        </div>
      ))}
      {matchedDailyNames.map((plant, index) => (
        <div key={plant.id} className="p-2 mb-2 bg-white rounded shadow">
          {plant.daily_name}
        </div>
      ))}
      {matchedPictures.map((plant, index) => (
        <div key={plant.id} className="p-2 mb-2 bg-white rounded shadow">
          {plant.Pictures && plant.Pictures[0] && (
            <img
              className="w-full h-48 object-cover"
              src={`http://localhost:3001/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}`}
              alt={plant.daily_name}
            />
          )}
        </div>
      ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>


  {/* Button to finalize the match and calculate the score */}
  <div className="text-center mt-4">
  <button
    onClick={confirmMatch}
    className="bg-blue-500 text-white px-6 py-2 rounded shadow-lg hover:bg-blue-600 transition-colors"
    disabled={matches.length >= 10} // Disable after 10 matches
  >
    {matches.length < 10 ? 'Confirm Match' : 'See Results'}
  </button>
</div>
</div>
</DragDropContext>
  );
};

export default Quiz;
