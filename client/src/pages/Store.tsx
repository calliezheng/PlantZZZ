import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


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
  const [quantities, setQuantities] = useState<{[productId: number]: number}>({});
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

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities(prev => ({...prev, [productId]: quantity}));
  };

  const handlePurchase = async (productId: number, quantity: number) => {
    try {
        const response = await axios.post(`http://localhost:3001/store/purchase/${id}`, {
            productId: productId,
            quantity: quantity
        });
        console.log(response.data);
        alert('Purchase successful!');
        window.location.reload();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Purchase failed:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
};

  return (
    <div className="container mx-auto p-4">
      {scores ? (
        <p>Score: {scores.score} <Link to={`/dashboard/store/${id}/cart`} className="hover:text-green-600"> Cart </Link></p>
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
              <input type="number" value={quantities[product.id] || 1} onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))} min="1" className="border rounded px-2 py-1 mr-2"/>
              <button onClick={() => handlePurchase(product.id, quantities[product.id] || 1)}>Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
