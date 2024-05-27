import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from './BackButton';

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
    const [products, setProducts] = useState<Product[]>([]);
    const id = localStorage.getItem('user_id');
  
    //Fetch data from back-end to get the Purchase history of specific user id
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
    
    // Filter products to hide those with a quantity of 0
    const filteredProducts = products.filter(product => parseInt(product.quantity) > 0);
    
    return (
        <div className="container mx-auto p-4">
            <BackButton />
            <h1 className="text-4xl font-bold font-poetsen text-white mb-5">Your Purchases</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-10">
                {filteredProducts.map((product) => (
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

export default Cart;
