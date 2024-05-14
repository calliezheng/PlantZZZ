import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult, DraggableLocation, Draggable} from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable} from '../helpers/StrictModeDroppable';
import axios from 'axios';

interface Cell {
  id: string;
  content: string | null;
  occupied: boolean;
}

interface Product {
    product_id: number;
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

  const moveProductToGarden = (product: Product, destination: DraggableLocation) => {
  const newGrid = Array.from(grid); // Shallow copy of the grid
  const destinationCoords = destination.droppableId.match(/cell-(\d+)-(\d+)/);
  if (destinationCoords) {
    const row = parseInt(destinationCoords[1], 10);
    const col = parseInt(destinationCoords[2], 10);
    const destinationCell = newGrid[row][col];

    if (!destinationCell.occupied) {
      destinationCell.content = `http://localhost:3001/images/products/${encodeURIComponent(product.Product.picture)}`;
      destinationCell.occupied = true;
      setGrid(newGrid);

      const updatedProducts = products.map(p => {
        if (p.product_id === product.product_id) {
          // Decrease the quantity by 1
          return {...p, total_quantity: (parseInt(p.total_quantity) - 1).toString()};
        }
        return p;
      }).filter(p => parseInt(p.total_quantity) > 0); // Optionally remove products with zero quantity

      setProducts(updatedProducts);
    }
  }
};

const moveProductToItems = (source: DraggableLocation, product: Product) => {
  const newGrid = Array.from(grid);
  const sourceCoords = source.droppableId.match(/cell-(\d+)-(\d+)/);
  if (sourceCoords) {
    const row = parseInt(sourceCoords[1], 10);
    const col = parseInt(sourceCoords[2], 10);
    const sourceCell = newGrid[row][col];

    if (sourceCell.occupied) {
      // Clear the cell content and occupied state
      sourceCell.content = null;
      sourceCell.occupied = false;
      setGrid(newGrid); // Update the grid state

      // Return the item to the product list
      const updatedProducts = products.map(p => {
        if (p.product_id === product.product_id) {
          // Increment the product quantity
          return {...p, total_quantity: (parseInt(p.total_quantity) + 1).toString()};
        }
        return p;
      });
      setProducts(updatedProducts); // Update the products state
    }
  }
};


const updateProductQuantity = async (productId:number, increment: boolean) => {
  const payload = {
    userId: id,
    productId: productId,
    increment: increment
  };
  try {
    await axios.post('http://localhost:3001/store', payload);
    console.log("Quantity updated successfully");
  } catch (error) {
    console.error("Failed to update quantity:", error);
  }
};


  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return; // Do nothing if dropped outside any droppable area

    const product = products.find(p => p.product_id.toString() === result.draggableId);
    if (!product) return;
    if (source.droppableId === "items-container" && destination.droppableId.includes("cell-")) {
      // Moving from items to garden
      moveProductToGarden(product, destination);
      updateProductQuantity(product.product_id, false); // Decrement
    } else if (source.droppableId.includes("cell-") && destination.droppableId === "items-container") {
      // Moving from garden back to items
      moveProductToItems(source, product);
      updateProductQuantity(product.product_id, true); // Increment
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
      {grid.flat().map((cell, index) => (
        <Droppable key={cell.id} droppableId={cell.id}>
          {(provided, snapshot) => (
            <Draggable key={cell.id} draggableId={cell.id} index={index}>
              {(providedDraggable) => (
                <div
                  ref={providedDraggable.innerRef}
                  {...providedDraggable.draggableProps}
                  {...providedDraggable.dragHandleProps}
                  style={{ margin: '1px', ...providedDraggable.draggableProps.style }}
                >
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      width: '50px',
                      height: '50px',
                      border: '1px solid black',
                      backgroundColor: snapshot.isDraggingOver ? '#f0e68c' : '#8B4513',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cell.content && (
                      <img src={cell.content} alt="Garden item" style={{ width: '100%', height: '100%' }} />
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Draggable>
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
            <Draggable key={product.product_id} draggableId={product.product_id.toString()} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{ margin: '10px', padding: '5px', border: '1px solid black' }}
                >
                  <img src={`http://localhost:3001/images/products/${encodeURIComponent(product.Product.picture)}`} alt={product.Product.product_name} style={{ width: '100%', height: 'auto' }} />
                  <p>{product.Product.product_name} x {product.total_quantity}</p>
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
