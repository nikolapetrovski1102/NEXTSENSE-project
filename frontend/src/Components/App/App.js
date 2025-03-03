import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ProductsList from '../Products/ProductsList';
import Layout from '../Layout/Layout';
import CartProducts from '../Cart/CartProducts';
import OrdersList from '../Orders/OrdersList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout children={<Login />} title="Login" />} />
        <Route path="/register" element={<Layout children={<Register />} title="Register" />} />
        <Route path="/products" element={<Layout children={<ProductsList />} title="Products" /> } />
        <Route path="/cart" element={<Layout children={<CartProducts />} title="Cart" /> } />
        <Route path="/orders" element={<Layout children={<OrdersList />} title="My orders" /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
