import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable} from '../helpers/StrictModeDroppable'; //Solve the problem between React 18 and react-beautiful-dnd Droppable 
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

interface MatchAttempt {
  academicId: number;
  dailyId: number;
  pictureId: number;
}

interface MatchPackage {
  items: Plant[];
  score: number;
  correctIds: Set<number>;
}

// Randomize the order of elements
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

const Quiz = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [matches, setMatches] = useState<MatchAttempt[]>([]); // An array to store matches
  const [score, setScore] = useState<number>(0);
  const [matchPackages, setMatchPackages] = useState<MatchPackage[]>([]);

  // Fetch data
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
        console.log('combinedPlants:', combinedPlants)
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

  console.log('Drag ended, result:', result); // Log the result of the drag

  // Exit if dropped outside the list
  if (!destination) return;

  // Parse the draggableId to get the type and id
  const [type, id] = draggableId.split('-');
  const parsedId = parseInt(id);

  console.log(`Dragged item type: ${type}, id: ${parsedId}`); // Log the type and ID

  // Find the item that's being dragged
  const draggedItem = plants.find(plant => plant.id === parsedId && plant.type === type);

  console.log('Dragged item:', draggedItem); // Log the dragged item

  if (draggedItem) {
    // If the destination is the matchBox, we need to update only the location
    if (destination.droppableId === 'matchBox') {
      setPlants(prevPlants => {
        const newPlants = prevPlants.map(p =>
          p.id === parsedId && p.type === type
            ? { ...p, location: destination.droppableId as 'academicNames' | 'dailyNames' | 'pictures' | 'matchBox'}
            : p
        );
        console.log('New plants after dropping in matchBox:', newPlants); // Log the new plants array
        return newPlants;
      });
    } else {
      // In case it's going back to its original list, reset the location
      setPlants(prevPlants => {
        const newPlants = prevPlants.map(p =>
          p.id === parsedId && p.type === type
            ? { ...p, location: p.type }
            : p
        );
        console.log('New plants after moving back to list:', newPlants); // Log the new plants array
        return newPlants;
      });
    }
  }
};

  
const getListByLocation = (location: 'academicNames' | 'dailyNames' | 'pictures' | 'matchBox') => {
  return plants.filter(plant => plant.location === location);
};


const confirmMatch = () => {
  // Retrieve items from the match box
  const matchedItems = plants.filter(plant => plant.location === 'matchBox');

  if (matchedItems.length === 3) {
    // Check if the matched items are from each category
    const hasAllTypes = ['academicNames', 'dailyNames', 'pictures'].every(type =>
      matchedItems.some(item => item.type === type)
    );
  
    if (hasAllTypes) {
      // Calculate score for the match
      const { score, correctIds } = calculateMatchScore(matchedItems);
  
      // Update the match packages state and score
      setMatchPackages(prevPackages => {
        const updatedMatchPackages = [
          ...prevPackages,
          { items: matchedItems, score, correctIds }
        ];
        
        // Check if this is the last match to be added
        if (updatedMatchPackages.length === 10) {
          // If it's the last match, navigate to the results page
          navigate('/quizresult', { state: { matchPackages: updatedMatchPackages } });
        }
        
        // Return the updated state
        return updatedMatchPackages;
      });
  
      setScore(prevScore => prevScore + score);
  
      // Remove the matched items from the current plants state
      setPlants(prevPlants => prevPlants.filter(plant => plant.location !== 'matchBox'));
    } else {
      alert("Please match one item from each category.");
    }
  } else {
    alert("Please match exactly three items.");
  }  
};


function calculateMatchScore(matchedItems: Plant[]): { score: number, correctIds: Set<number> } {
  // Find the items that are in the match box for each type
  const matchedAcademic = matchedItems.find(item => item.type === 'academicNames');
  const matchedDaily = matchedItems.find(item => item.type === 'dailyNames');
  const matchedPicture = matchedItems.find(item => item.type === 'pictures');

  let correctIds = new Set<number>();

  // Check if all three parts match
  if (matchedAcademic && matchedDaily && matchedPicture) {
    if (matchedAcademic.id === matchedDaily.id && matchedDaily.id === matchedPicture.id) {
      // All items match, perfect match
      correctIds.add(matchedAcademic.id);
      return { score: 3, correctIds };
    } else {
      // Check for partial matches
      if (matchedAcademic.id === matchedDaily.id) {
        correctIds.add(matchedAcademic.id);
      }
      if (matchedDaily.id === matchedPicture.id) {
        correctIds.add(matchedDaily.id);
      }
      if (matchedAcademic.id === matchedPicture.id) {
        correctIds.add(matchedAcademic.id);
      }
    }
  }

  return {
    score: correctIds.size, // Score is the number of correct IDs
    correctIds
  };
}

const quitQuiz = () => {
  if (window.confirm('Are you sure you want to quit the quiz?')) {
    navigate('/choosequiz'); 
  }
};

  return (
    
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col items-center justify-center pt-10">
        <h3 className="text-2xl font-bold font-poetsen text-beige bg-green-700 mb-5">*Drag the matching names and picture into the match box and confirm</h3>
        <div className="grid grid-cols-5 gap-4">

        {/* Academic name container */}
        <Droppable droppableId="academicNames">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="col-span-1 bg-beige p-3 rounded shadow overflow-auto"
            style={{ backgroundColor: snapshot.isDraggingOver ? '#81C784' : '' }}
          >
            <h3 className="text-xl text-brown font-bold font-poetsen text-center mb-2">Academic Names</h3>
            {getListByLocation('academicNames').map((plant, index) => (
              <Draggable key={`academicNames-${plant.id}`} draggableId={`academicNames-${plant.id}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 mb-2 bg-green-600 rounded shadow cursor-pointer font-opensans text-white"
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

      {/* Daily name container */}
      <Droppable droppableId="dailyNames">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="col-span-1 bg-beige p-3 rounded shadow-lg overflow-auto"
          style={{ backgroundColor: snapshot.isDraggingOver ? '#81C784' : '' }}
        >
          <h3 className="text-xl text-brown font-bold font-poetsen text-center mb-2">Daily Names</h3>
          {getListByLocation('dailyNames').map((plant, index) => (
            <Draggable key={`dailyNames-${plant.id}`} draggableId={`dailyNames-${plant.id}`} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="p-2 mb-2 bg-green-600 rounded shadow cursor-pointer font-opensans text-white"
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

    {/* Picture container */}
    <Droppable droppableId="pictures">
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="col-span-3 bg-beige p-3 rounded shadow-lg overflow-auto"
        style={{ backgroundColor: snapshot.isDraggingOver ? '#81C784' : '' }}
      >
        <h3 className="text-xl text-brown font-bold font-poetsen text-center mb-2">Pictures</h3>
        <div className="flex flex-wrap justify-start items-start">
        {getListByLocation('pictures').map((plant, index) => (
          <Draggable key={`pictures-${plant.id}`} draggableId={`pictures-${plant.id}`} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="p-2 mb-4 bg-green-600 rounded shadow cursor-pointer font-opensans text-white w-1/3"
                style={{ maxWidth: "20%"}}
              >
                {plant.Pictures && plant.Pictures[0] && (
              <img
                className="w-full"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                src={plant.Pictures.length > 0 ? `http://localhost:3001/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}` : '/images/plants/picture_is_missing.png'}
                alt={plant.academic_name}
              />
            )}
              </div>
            )}
            
      </Draggable>
      ))}
      </div>
      {provided.placeholder}
    </div>
  )}
</Droppable>

{/* Match box container */}
<div className="col-span-3 h-80 p-3 bg-beige rounded shadow-lg">
  <div className="text-xl text-brown font-bold font-poetsen text-center mb-2">Match Box</div>
    <Droppable droppableId="matchBox">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-row flex-wrap justify-start items-start gap-2 p-3 rounded shadow-lg overflow-auto h-full text-white font-opensans"
                style={{ backgroundColor: snapshot.isDraggingOver ? '#81C784' : '' }}
              >
                {getListByLocation('matchBox').map((plant, index) => (
                  <Draggable key={`match-${plant.id}-${plant.type}`} draggableId={`${plant.type}-${plant.id}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 mb-2 bg-green-600 rounded shadow cursor-pointer"
                        style={{ height: '220px', width: '200px' }}
                      >
                        {
                          plant.type === 'academicNames' && (
                            <div className="name-display">{plant.academic_name}</div>
                          )
                        }
                        {
                          plant.type === 'dailyNames' && (
                            <div className="name-display">{plant.daily_name}</div>
                          )
                        }
                        {
                          plant.type === 'pictures' && plant.Pictures && plant.Pictures[0] && (
                            <img
                              className="w-full object-cover"
                              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                              src={`http://localhost:3001/images/plants/${encodeURIComponent(plant.Pictures[0].picture_file_name)}`}
                              alt={plant.daily_name}
                            />
                          )
                        }
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
        </Droppable>
      </div>

    <div className="flex flex-col text-center mt-4 space-y-4">
      <button
        onClick={confirmMatch}
        className="bg-green-600 text-white font-opensans px-6 py-2 rounded shadow-lg hover:bg-green-700 transition-colors"
        disabled={matches.length >= 10} // Disable after 10 matches
      >
        {matches.length < 10 ? 'Confirm Match' : 'See Results'}
      </button>
      <button 
        onClick={quitQuiz} 
        className="bg-red-600 text-white font-opensans px-6 py-2 rounded shadow-lg hover:bg-red-700 transition-colors"
        >Quit
      </button>
    </div>
  </div>
</div>
</DragDropContext>
  );
};

export default Quiz;
