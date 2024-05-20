import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Product {
    product_id: number;
    quantity: string;  
    Product: {
        id: number;
        product_name: string;
        picture: string;
    };
}

function Cart() {
    const [products, setProducts] = useState<Product[]>([]);;
    const id = localStorage.getItem('user_id');
    const navigate = useNavigate();
  
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
        <div className="container mx-auto p-4">
            <div className="absolute left-5 m-4">
                <button onClick={() => navigate(-1)} className="bg-brown-light text-white font-bold font-opensans px-6 py-2 rounded shadow-lg hover:bg-brown transition-colors items-start">back</button>
            </div>
            <h1 className="text-4xl font-bold font-poetsen text-white mb-5">Your Purchases</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-10">
                {products.map((product) => (
                    <div key={product.product_id} className="max-w-sm rounded overflow-hidden shadow-lg bg-beige">
                        <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(product.Product.picture)}`} alt={product.Product.product_name} />
                        <div className="px-6 py-4">
                            <div className="font-bold font-opensans text-xl text-brown mb-2">{product.Product.product_name}</div>
                            <p className="font-bold font-opensans text-base text-brown">Quantity: {product.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default Cart
