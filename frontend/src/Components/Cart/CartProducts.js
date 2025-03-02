import React, { useState, useEffect } from "react";
import Notification from "../Notification/Notification";

import { Axios } from "../Axios";

const axios = new Axios();

export default function CartProducts() {
  const [cartItems, setCartItems] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const [shipmentInfo, setShipmentInfo] = useState({
    full_name: "",
    phone: "",
    address: "",
    description: "",
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const cartItems = localStorage.getItem("cart");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        if (item.stockQuantity < newQuantity) {
          return { ...item, quantity: item.stockQuantity };
        }else{
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    setCheckout(true);

    if (checkout){
      if (!shipmentInfo.full_name || !shipmentInfo.phone || !shipmentInfo.address) {
        setNotification({ message: 'Please enter your shipping information.', status: 'error' });
        return;
      }

      var checkoutDTO = {
        "shipmentInfo": shipmentInfo,
        "cartItems": cartItems,
        "totalPrice": totalPrice
      };

      axios.post("Order/create-order", checkoutDTO).then((response) => {
        if (response.status === 200) {
          setNotification({ message: 'Checkout successful', status: 'success' });
          setTimeout(() => {
            localStorage.removeItem("cart");
            window.location.href = '/orders';
          }, 1000);
        }
      }).catch((error) => {
        setNotification({ message: 'Checkout failed', status: 'error' });
      });
    }
  };

  return (
    <div>
      {notification && (
          <Notification 
              message={notification.message}
              status={notification.status}
              onClose={() => setNotification(null)}
          />
      )}
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <section className="bg-white antialiased">
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Shopping Cart</h2>
            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
              {checkout === false ? (
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                          <a href="#" className="shrink-0 md:order-1">
                            <img
                              className="h-20 w-20"
                              src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                              alt="product image"
                            />
                          </a>

                          <div className="flex items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900"
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-end md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <p className="text-base font-medium text-gray-900">{item.name}</p>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                              >
                                <svg
                                  className="me-1.5 h-5 w-5"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                  <div className="space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                            <span className="text-red-500" >*</span> Full Name
                          </label>
                          <input
                            value={shipmentInfo.full_name}
                            onChange={(e) => setShipmentInfo({ ...shipmentInfo, full_name: e.target.value })}
                            type="text"
                            id="fullname"
                            name="order_customer_fullname"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nikola Petrovski"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="text-red-500" >*</span> Shipping Address
                          </label>
                          <input
                            value={shipmentInfo.address}
                            onChange={(e) => setShipmentInfo({ ...shipmentInfo, address: e.target.value })}
                            id="address"
                            name="order_address"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Zagrebska 1, Skopje"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            <span className="text-red-500" >*</span> Phone Number
                          </label>
                          <input
                            value={shipmentInfo.phone}
                            onChange={(e) => setShipmentInfo({ ...shipmentInfo, phone: e.target.value })}
                            type="tel"
                            id="phone"
                            name="order_customer_phone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+389 71 456 789"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Order Notes
                          </label>
                          <textarea
                            value={shipmentInfo.description}
                            onChange={(e) => setShipmentInfo({ ...shipmentInfo, description: e.target.value })}
                            id="description"
                            name="order_description"
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Special delivery instructions"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}

              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                  <p className="text-xl font-semibold text-gray-900">Order summary</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500">Total items</dt>
                        <dd className="text-base font-medium text-gray-900">{cartItems.length}</dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500">Original price</dt>
                        <dd className="text-base font-medium text-gray-900">
                          ${totalPrice.toFixed(2)}
                        </dd>
                      </dl>
                    </div>

                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                      <dt className="text-base font-bold text-gray-900">Total</dt>
                      <dd className="text-base font-bold text-gray-900">
                        ${totalPrice.toFixed(2)}
                      </dd>
                    </dl>
                  </div>

                  <button onClick={handleCheckout} className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-gray-900 border border-bg-gray-200">
                    {checkout ? "Place order" : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}