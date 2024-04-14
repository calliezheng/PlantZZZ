import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

const Quiz = () => {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    // Fetch plants when the component loads
    const fetchPlants = async () => {
      const response = await axios.get(`http://localhost:3001/quiz`);
      setPlants(response.data);
    };

    fetchPlants();
  }, []);

  // Handle drag and drop logic here
  const onDragEnd = (result: DropResult) => {
    // Implement the logic to reorder the answers based on the drag result
    // Use result.source and result.destination
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Example Droppable and Draggable components */}
      <Droppable droppableId="droppable-plant-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {plants.map((plant, index) => (
              <Draggable key={plant.id} draggableId={`draggable-${plant.id}`} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {plant.academic_name} - {plant.daily_name}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Quiz;
