import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult, DraggableLocation, Draggable} from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable} from '../helpers/StrictModeDroppable';
import axios from 'axios';

interface ProductInfo {
  productId: string;
  imageUrl: string;
}

interface Cell {
  id: string;
  content: ProductInfo | null;
  occupied: boolean;
}

interface Product {
    product_id: number;
    quantity: string;  
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

  useEffect(() => {
    const fetchGardenAndProducts = async () => {
      try {
        const [gardenResponse, productsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/garden/${id}/garden`),
          axios.get(`http://localhost:3001/store/${id}/cart`)
        ]);
        console.log('Garden State from the server:', gardenResponse.data);
        if (gardenResponse.data.garden_state) {
          const savedGrid: Cell[][] = JSON.parse(gardenResponse.data.garden_state);
          console.log(savedGrid);
          setGrid(savedGrid);
        } else {
          setGrid(createEmptyGrid(16, 30));
        }
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Failed to fetch garden or purchases:', error);
        // Set to default grid if there is an issue
        setGrid(createEmptyGrid(16, 30));
      }
    };

    fetchGardenAndProducts();
  }, [id]);

  const moveProductToGarden = async (product: Product, destination: DraggableLocation) => {
  const newGrid = Array.from(grid); 
  const destinationCoords = destination.droppableId.match(/cell-(\d+)-(\d+)/);
  if (destinationCoords) {
    const row = parseInt(destinationCoords[1], 10);
    const col = parseInt(destinationCoords[2], 10);
    const destinationCell = newGrid[row][col];

    if (!destinationCell.occupied) {
      destinationCell.content = {
        productId: product.Product.id.toString(),  // Store the product ID
        imageUrl: `http://localhost:3001/images/products/${encodeURIComponent(product.Product.picture)}` // Store the image URL
      };
      destinationCell.occupied = true;
      setGrid(newGrid);

      setProducts(prevProducts => prevProducts.map(p => {
        if (p.product_id === product.product_id) {
          // Decrease the quantity by 1 but do not filter out
          return {...p, quantity: Math.max(0, parseInt(p.quantity) - 1).toString()};
        }
        return p;
      }));
      
      await saveGardenState();
    }
  }
};

const moveProductToItems = async (source: DraggableLocation, product: Product) => {
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
      setProducts(prevProducts => prevProducts.map(p => {
        if (p.product_id === product.product_id) {
          // Increment the product quantity
          return {...p, quantity: (parseInt(p.quantity) + 1).toString()};
        }
        return p;
      }));

      await saveGardenState();
    }
  }
  console.log(`Product ${product.product_id} moved back to items. New state:`, products);
};

const moveItemWithinGarden = async (source: DraggableLocation, destination: DraggableLocation) => {
  // Create a shallow copy of the grid to manipulate
  const newGrid = [...grid];

  // Parse the row and column from the droppableId of source and destination
  const sourceCoords = source.droppableId.match(/cell-(\d+)-(\d+)/);
  const destinationCoords = destination.droppableId.match(/cell-(\d+)-(\d+)/);

  if (sourceCoords && destinationCoords) {
    const sourceRow = parseInt(sourceCoords[1], 10);
    const sourceCol = parseInt(sourceCoords[2], 10);
    const destinationRow = parseInt(destinationCoords[1], 10);
    const destinationCol = parseInt(destinationCoords[2], 10);

    // Access the source and destination cells using their coordinates
    const sourceCell = newGrid[sourceRow][sourceCol];
    const destinationCell = newGrid[destinationRow][destinationCol];

    // Move the content from the source cell to the destination cell
    if (!destinationCell.occupied) {
      destinationCell.content = sourceCell.content;
      destinationCell.occupied = true;

      // Clear the source cell
      sourceCell.content = null;
      sourceCell.occupied = false;
    }

    // Update the grid state to reflect the changes
    setGrid(newGrid);
    await saveGardenState();
  }
};


const onDragEnd = (result: DropResult) => {
  const { source, destination, draggableId } = result;
  console.log(`Drag ended from ${source.droppableId} to ${destination ? destination.droppableId : "none"}`);

  if (!destination) return;  // Do nothing if dropped outside a droppable area

  if (source.droppableId.includes("cell-") && destination.droppableId.includes("cell-")) {
    // Handle item movement within the garden
    moveItemWithinGarden(source, destination);
  } else if (source.droppableId === "items-container" && destination.droppableId.includes("cell-")) {
    // Moving from items to garden
    const product = products.find(p => p.product_id.toString() === draggableId);
    if (product) {
      console.log(`Item with draggableId ${draggableId} is being moved from items-container to a garden cell.`);
      moveProductToGarden(product, destination);
      updateProductQuantity(product.product_id, false); // Decrement product count
    }
  } else if (source.droppableId.startsWith("cell-") && destination.droppableId === "items-container") {
    // Moving from garden back to items
    // Extract numeric ID from draggableId if formatted like "cell-x-y"
    
    const coords = source.droppableId.match(/cell-(\d+)-(\d+)/);
    if (coords) {
        const row = parseInt(coords[1], 10);
        const col = parseInt(coords[2], 10);
        const cell = grid[row][col];

        // Check if the cell and content are not null
        if (cell && cell.content) {
            const productID = cell.content.productId;
            console.log("product:", productID);
            const product = products.find(p => p.product_id.toString() === productID);
            console.log("product:", product);
            if (product) {
                console.log("Moving item from garden cell back to items container.");
                moveProductToItems(source, product);
                updateProductQuantity(product.product_id, true); // Increment product count
            }
        } else {
            console.log("Cell or cell content is null");
        }
    }
  }
};

const updateProductQuantity = async (productId:number, increment: boolean) => {
  const payload = {
    productId: productId,
    increment: increment
  };
  try {
    await axios.post(`http://localhost:3001/garden/${id}/cart`, payload);
    console.log("Quantity updated successfully");
  } catch (error) {
    console.error("Failed to update quantity:", error);
  }
};

const saveGardenState = async () => {
  try {
    const serializedGarden = JSON.stringify(grid);  // Convert the current grid state to a JSON string
    await axios.post(`http://localhost:3001/garden/${id}/garden`, {
      userId: id,
      gardenState: serializedGarden  // Send the serialized garden as part of your POST request
    });
    console.log("Garden state saved successfully.");
  } catch (error) {
    console.error('Failed to save garden state:', error);
  }
};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center items-start w-full min-h-screen">
        <div className="flex flex-wrap justify-center garden">
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
                          backgroundColor: snapshot.isDraggingOver ? 'highlight' : '#8B4513',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {cell.occupied && cell.content && (
                          <img src={cell.content.imageUrl} alt="Garden item" style={{ width: '100%', height: '100%' }} />
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
    <div className="w-36 h-full overflow-y-auto shadow-lg max-h-full" style={{height: 'calc(16.6 * 50px)'}}>
      <Droppable droppableId="items-container">
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-2"
          >
            {products.map((product, index) => {
              // Check if the product quantity is greater than 0
              if (parseInt(product.quantity, 10) > 0) {
                return (
                  <Draggable key={product.product_id} draggableId={product.product_id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2"
                      >
                        <img src={`http://localhost:3001/images/products/${encodeURIComponent(product.Product.picture)}`} alt={product.Product.product_name} className="w-16 h-16 object-cover" />
                        <p className="text-center text-sm">{product.Product.product_name} x {product.quantity}</p>
                      </div>
                    )}
                  </Draggable>
                );
              }
              return null;  // Return null for products with a quantity of 0, thus not rendering them
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      </div>
      </div>
    </DragDropContext>
  );
}

export default Garden;
