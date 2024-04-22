import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable} from '../helpers/StrictModeDroppable'; //Solve the problem between React 18 and react-beautiful-dnd Droppable 

interface Plant {
  id: number;
  academic_name: string;
  daily_name: string;
  Pictures?: Picture[];
  location: 'academicNames' | 'dailyNames' | 'pictures' | 'matchBox';
  type: 'academicNames' | 'dailyNames' | 'pictures';
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
      try {
        const response = await axios.get(`http://localhost:3001/quiz`);
        // Shuffle the fetched data
        let shuffledData = shuffleArray(response.data);
  
        // Assign a location to each plant part
        const academicNamesWithLocation = shuffledData.map(plant => ({
          ...plant,
          location: 'academicNames',
          type: 'academicNames'
        }));
        const dailyNamesWithLocation = shuffleArray([...shuffledData]).map(plant => ({
          ...plant,
          location: 'dailyNames',
          type: 'dailyNames'
        }));
        const picturesWithLocation = shuffleArray([...shuffledData]).map(plant => ({
          ...plant,
          location: 'pictures',
          type: 'pictures'
        }));
  
        // Combine all parts into one array
        const combinedPlants = [
          ...academicNamesWithLocation,
          ...dailyNamesWithLocation,
          ...picturesWithLocation,
        ];
  
        // Set the combined plants with location to state
        setPlants(combinedPlants);
      } catch (error) {
        console.error("Error fetching plants data:", error);
      }
    };
  
    fetchPlants();
  }, []);
  
  // Handle drag and drop logic
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
  
    // Exit if dropped outside the list
    if (!destination) return;
  
    // Parse the draggableId to get the type and id
    const [type, id] = draggableId.split('-');
    const parsedId = parseInt(id);
  
    // Find the item that's being dragged
    const draggedItem = plants.find(plant => plant.id === parsedId && plant.type === type);
  
    if (draggedItem) {
      // If the destination is the matchBox, we need to update only the location
      if (destination.droppableId === 'matchBox') {
        setPlants(prevPlants => prevPlants.map(p =>
          p.id === parsedId && p.type === type
            ? { ...p, location: destination.droppableId as 'academicNames' | 'dailyNames' | 'pictures' | 'matchBox'}
            : p
        ));
      } else {
        // In case it's going back to its original list, reset the location
        setPlants(prevPlants => prevPlants.map(p =>
          p.id === parsedId && p.type === type
            ? { ...p, location: p.type }
            : p
        ));
      }
    }
  };
  
const getListByLocation = (location: 'academicNames' | 'dailyNames' | 'pictures' | 'matchBox') => {
  return plants.filter(plant => plant.location === location);
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
            {/* Filter and map over academicNames only */}
            {getListByLocation('academicNames').map((plant, index) => (
              <Draggable key={`academicNames-${plant.id}`} draggableId={`academicNames-${plant.id}`} index={index}>
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
            {/* Filter and map over academicNames only */}
            {getListByLocation('dailyNames').map((plant, index) => (
              <Draggable key={`dailyNames-${plant.id}`} draggableId={`dailyNames-${plant.id}`} index={index}>
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
            {getListByLocation('pictures').map((plant, index) => (
              <Draggable key={`pictures-${plant.id}`} draggableId={`pictures-${plant.id}`} index={index}>
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
            <div className="text-center font-bold">Match Box</div>
            {/* Filter and map over items that are in the matchBox */}
            {getListByLocation('matchBox').map((plant, index) => (
              <Draggable key={`match-${plant.id}-${plant.type}`} draggableId={`match-${plant.id}-${plant.type}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
                  >
                    {/* Show either name or image depending on the item type */}
                    {plant.academic_name || plant.daily_name || (
                      plant.Pictures && plant.Pictures[0] && (
                        <img
                          className="w-full"
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          src={plant.Pictures.length > 0 ? `http://localhost:3001/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}` : '/images/plants/picture_is_missing.png'}
                          alt={plant.daily_name}
                        />
                      )
                    )}
                  </div>
                )}
              </Draggable>
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
