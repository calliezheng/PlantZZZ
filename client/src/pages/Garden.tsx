import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Product {
    product_id: number;
    product_name: string;
    picture: string;
}

function ItemSelector() {
    const [items, setItems] = useState<Product[]>([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/store/${userId}/cart`);
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };

        fetchItems();
    }, [userId]);

    const onDragEnd = (result:unknown) => {
        // Logic to handle item reordering if necessary
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="items">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="container mx-auto p-4">
                        <h1>Drag Items to Your Garden</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item, index) => (
                                <Draggable key={item.product_id} draggableId={`item-${item.product_id}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer">
                                            <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(item.picture)}`} alt={item.product_name} />
                                            <div className="px-6 py-4">
                                                <div className="font-bold text-xl mb-2">{item.product_name}</div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default ItemSelector;
