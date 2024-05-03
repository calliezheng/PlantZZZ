import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Score {
  score: number;
}

interface Product {
  id: number;
  product_name: string;
  product_type: number;
  price:number;
  picture: string
}

interface Product_Type {
  id: number;
  type_name: string
}

function Store() {
  const [scores, setScores] = useState<Score | null>(null); 
  const [products, setProducts] = useState<Product[]>([]);
  const id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/store/${id}`); 
        console.log("Scores fetched:", response.data);
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/store`); 
        console.log("Products fetched:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {scores ? (
        <p>Score: {scores.score}</p>
      ) : (
        <p>Loading scores...</p>
      )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(product.picture)}`} alt={product.product_name} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{product.product_name}</div>
              <p className="text-gray-700 text-base">Price: ${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
