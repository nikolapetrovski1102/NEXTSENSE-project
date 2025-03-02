import React, { useState } from "react";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <header className="bg-white text-black p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Shop</h1>
      <div className="relative">
        <button className="flex items-center space-x-2" onClick={addToCart}>
          <span role="img" aria-label="cart" className="text-2xl">
            🛒
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
