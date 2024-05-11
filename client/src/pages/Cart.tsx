import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
    product_id: number;
    total_quantity: string;  
    Product: {
        id: number;
        product_name: string;
        picture: string;
    };
}

function Cart() {
    const [products, setProducts] = useState<Product[]>([]);;
    const id = localStorage.getItem('user_id');
  
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
        <h1>Your Purchases</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <div key={product.product_id} className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(product.Product.picture)}`} alt={product.Product.product_name} />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{product.Product.product_name}</div>
                        <p className="text-gray-700 text-base">Quantity: {product.total_quantity}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Cart
