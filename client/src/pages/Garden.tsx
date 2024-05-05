import React, { useState } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable} from '../helpers/StrictModeDroppable';

interface SquareState {
  product_id?: number;
  product_name?: string;
  picture?: string;
}

function Garden() {
  const initialGrid: SquareState[][] = Array(10).fill(null).map(() => Array(10).fill({}));
  const [grid, setGrid] = useState<SquareState[][]>(initialGrid);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    if (!destination) {
        return; // dropped outside any droppable area
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return; // dropped back to the same position
    }

    // Convert IDs back to numbers for indexing
    const sourceId = parseInt(source.droppableId);
    const destId = parseInt(destination.droppableId);

    // Perform a deep copy of the grid to manipulate the state
    const newGrid = JSON.parse(JSON.stringify(grid)); // or use another method to deep clone

    // Remove the item from the original position and insert it into the new position
    const [movedItem] = newGrid[sourceId].splice(source.index, 1);
    newGrid[destId].splice(destination.index, 0, movedItem);

    setGrid(newGrid);
}


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {grid.map((row, rowIndex) => (
        <Droppable droppableId={`row-${rowIndex}`} direction="horizontal" key={rowIndex}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="row"
            >
              {row.map((cell, index) => (
                <Draggable key={cell.product_id} draggableId={`item-${cell.product_id}-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="square"
                    >
                      {cell.picture && (
                        <img src={`http://localhost:3001/images/products/${encodeURIComponent(cell.picture)}`} alt={cell.product_name} />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
}

export default Garden;
