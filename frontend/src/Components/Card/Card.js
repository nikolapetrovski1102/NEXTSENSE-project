import React, { useState, useEffect } from "react";
import Notification from "../Notification/Notification";

export default function Card({ 
    id, 
    name, 
    price, 
    quantity: stockQuantity,
    manufacturer,
  }) {
    const [notification, setNotification] = useState(null);

    const handleAddToCart = () => {
        if (stockQuantity === 0) {
            setNotification({ message: "This item is out of stock!", status: 'error' });
            return;
        }
    
        const existingCart = localStorage.getItem("cart");
        let cart = existingCart ? JSON.parse(existingCart) : [];
    
        const existingItemIndex = cart.findIndex(item => item.id === id);
    
        if (existingItemIndex !== -1) {
            const updatedCart = cart.map((item, index) => {
                if (index === existingItemIndex) {
                    const newQuantity = item.quantity + 1;
                    if (newQuantity > stockQuantity) {
                        setNotification({ message: `Only ${stockQuantity} items available in stock!`, status: 'error' });
                        return item;
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            
            if (updatedCart[existingItemIndex].quantity > cart[existingItemIndex].quantity) {
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            }

            setNotification({ message: `${name} added to cart!`, status: 'success' });

        } else {
            if (stockQuantity < 1) {
                setNotification({ message: "This item is out of stock!", status: 'error' });
                return;
            }
            
            const newItem = { id, name, price, quantity: 1, stockQuantity };
            localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
        }
    };
    
    return (
        <div className={`${stockQuantity === 0 ? "opacity-50 pointer-events-none" : ""} relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-[600px] h-[50dvh]`}>
                {notification && (
                    <Notification 
                        message={notification.message} 
                        status={notification.status} 
                        onClose={() => setNotification(null)} 
                    />
                )}
            <div className="relative p-2.5 h-96 overflow-hidden rounded-xl bg-clip-border">
                <img
                    src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                    alt="product-image"
                    className="h-full w-full object-cover rounded-md"
                />
            </div>
            <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-slate-800 text-xl font-semibold">{name}</p>
                    <p className="text-cyan-600 text-xl font-semibold">${price.toFixed(2)}</p>
                </div>
                <p className="text-slate-600 leading-normal font-light">{manufacturer}</p>
                    <div className="mt-2">
                        {stockQuantity === 0 ? (
                            <span className="text-red-600">Out of Stock</span>
                        ) : stockQuantity < 10 ? (
                            <span className="text-red-600">only {stockQuantity} left</span>
                        ) : (
                            <span className="text-green-600">Available</span>
                        )}
                    </div>
                <button
                    onClick={handleAddToCart}
                    className="rounded-md w-full mt-6 bg-slate-200 py-2 px-4 border border-transparent text-center text-md text-gray-800 transition-all shadow-md hover:shadow-lg focus:bg-gray-800 focus:shadow-none active:bg-gray-800 hover:bg-gray-800 hover:text-white active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    disabled={stockQuantity === 0}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
