import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult, DraggableLocation, Draggable} from 'react-beautiful-dnd';
import axios from 'axios';

interface Cell {
  id: string;
  content: string | null;
  occupied: boolean;
}

interface Product {
    product_id: string;
    total_quantity: string;  
    Product: {
        id: number;
        product_name: string;
        picture: string;
    };}

const createEmptyGrid = (rows: number, cols: number): Cell[][] => 
  Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex): Cell => ({
      id: `cell-${rowIndex}-${colIndex}`,
      content: null,
      occupied: false
    }))
  );

function Garden() {
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid(16, 30));
  const [products, setProducts] = useState<Product[]>([]);;
  const id = localStorage.getItem('user_id');

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return; // No movement happened
    }

    // Process the result to update grid
    updateGrid(source, destination);
  };

  // Assuming you have a function to update the grid based on drag results
  const updateGrid = (source: DraggableLocation, destination: DraggableLocation) => {
    const newGrid = Array.from(grid); // Creating a shallow copy of the grid
    const sourceCell = grid.flat().find(cell => cell.id === source.droppableId);
    const destinationCell = grid.flat().find(cell => cell.id === destination.droppableId);

    if (sourceCell && destinationCell) {
      destinationCell.content = sourceCell.content; // Move content
      destinationCell.occupied = true;
      sourceCell.content = null; // Clear source
      sourceCell.occupied = false;
      setGrid(newGrid);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/store/${id}/cart`);
            console.log(response);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
        }
    };

    fetchProducts();
}, [id]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="garden" style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1600px', margin: 'auto' }}>
        {grid.flat().map((cell) => (
          <Droppable key={cell.id} droppableId={cell.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ width: '50px', height: '50px', border: '1px solid black', backgroundColor: '#8B4513', margin: '1px' }}
              >
                {cell.content && <img src={cell.content} alt="Garden item" style={{ width: '100%', height: '100%' }} />}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>

      <Droppable droppableId="items-container">
      {(provided) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="items-container"
          style={{ width: 300, height: 'auto', border: '1px solid grey', padding: 10 }}
        >
          {products.map((product, index) => (
            <Draggable key={product.product_id} draggableId={product.product_id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{ margin: '10px', padding: '5px', border: '1px solid black' }}
                >
                  <img src={`http://localhost:3001/images/products/${encodeURIComponent(product.Product.picture)}`} alt={product.Product.product_name} style={{ width: '100%', height: 'auto' }} />
                  <p>{product.Product.product_name}</p>
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
}

export default Garden;
