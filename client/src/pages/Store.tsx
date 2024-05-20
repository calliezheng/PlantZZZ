import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


interface Score {
  score: number;
}

interface Product {
  id: number;
  product_name: string;
  product_type: number;
  price:number;
  picture: string;
  ProductType: {
    id: number;
    type_name: string
  }
}

function Store() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTypeName, setCurrentTypeName] = useState<string>("Plant");
  const [quantities, setQuantities] = useState<{[productId: number]: number}>({});
  const id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchScoresAndProducts = async () => {
      try {
        const scoreResponse = await axios.get(`http://localhost:3001/store/${id}`);
        setScores(scoreResponse.data);

        const productsResponse = await axios.get('http://localhost:3001/store');
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchScoresAndProducts();
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

  const productTypes = Array.from(new Set(products.map(p => p.ProductType.type_name)));  // Create a unique list of type_names

  const filteredProducts = products.filter(product => currentTypeName === null || product.ProductType.type_name === currentTypeName);

  return (
    <div className="container mx-auto p-4">
      <div className="absolute left-5 m-4">
        <button onClick={() => navigate(-1)} className="bg-brown-light text-white font-bold font-opensans px-6 py-2 rounded shadow-lg hover:bg-brown transition-colors items-start">back</button>
      </div>
      {scores ? (
        <p className="text-2xl mb-4 font-bold font-opensans text-brown">Score: {scores.score} <button className="bg-brown-light text-white font-bold font-opensans px-6 py-2 rounded shadow-lg hover:bg-brown transition-colors ml-4"><Link to={`/dashboard/store/${id}/cart`} className="text-beige"> Cart </Link></button></p>
      ) : (
        <p className="text-2xl mb-4 font-bold font-opensans text-brown">Loading scores...</p>
      )}

      <div className="flex space-x-4 mb-4">
        {productTypes.map((type) => (
          <button
            key={type}
            onClick={() => setCurrentTypeName(type)}
            className={`text-lg font-poetsen text-brown px-4 py-2 rounded-lg shadow hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out mb-4 ${currentTypeName === type ? 'font-bold bg-green-600' : 'bg-beige'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(product.picture)}`} alt={product.product_name} />
            <div className="px-6 py-4 bg-beige">
              <div className="font-bold font-opensans text-xl text-brown mb-2">{product.product_name}</div>
              <p className="font-bold font-opensans text-base text-brown mb-2">Price: ${product.price.toFixed(2)}</p>
              <input type="number" value={quantities[product.id] || 1} onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))} min="1" className="border rounded px-2 py-1 mr-2 font-opensans"/>
              <button onClick={() => handlePurchase(product.id, quantities[product.id] || 1)} className="mr-4 font-poetsen text-green-600 text-lg">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
