import React, { useState, useEffect } from "react";
import { Axios } from "../Axios";
import { OrderStatus } from "./OrderStatus";
import OrderDetails from "./Modals/OrderDetails";
import FullScreenLoader from "../FullScreenLoader/FullScreenLoader";

const axios = new Axios();

export default function OrdersList() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [orderDetails, setOrderDetails] = useState({
        order: {},
        order_details: {}
    });

    useEffect(() => {
        setLoading(true);
        axios.get(`Order/get-orders/${1}`).then((response) => {
            if (response.status === 200) {
                setOrders(response.data);
                setLoading(false);
            }
        });
    }, []);

    const fetchMoreDetails = (order_id) => {
        setLoading(true);
        axios.get(`Order/get-order-details/${order_id}`).then((response) => {
            if (response.status === 200) {
                const orderWithDetails = {
                    order: orders.find(o => o.id === order_id),
                    order_details: response.data
                };
                setIsModalOpen(true);
                setOrderDetails(orderWithDetails);
                setLoading(false);
            }
        });
    }

    const handleCancelOrder = (order_id) => {
        axios.post(`Order/cancel-order/${order_id}`).then((response) => {
            if (response.status === 200) {
                window.location.reload();
            }
        });
    }

    return (
        <div className="flow-root p-5 overflow-y-auto h-[70dvh]">
            <div className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                    <div className="h-[60dvh] flex flex-col items-center justify-center text-gray-500">
                        <p className="text-lg font-semibold">Your cart is empty</p>
                        <p className="text-sm mt-2">No orders yet you can start adding products here <a href="/products" > here</a>!</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-wrap items-center gap-y-4 py-6 border border-bg-gray-200 rounded-lg p-5 shadow-sm m-2"
                        >
                            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500">Order ID:</dt>
                                <dd className="mt-1.5 text-base font-semibold text-gray-900">
                                    <a href="#" className="hover:underline">
                                        #{order.id}
                                    </a>
                                </dd>
                            </dl>

                            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500">Date:</dt>
                                <dd className="mt-1.5 text-base font-semibold text-gray-900">{order.orderDate.split("T")[0].split("-").reverse().join("-")}</dd>
                            </dl>

                            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500">Total Price:</dt>
                                <dd className="mt-1.5 text-base font-semibold text-gray-900">${order.orderTotal}</dd>
                            </dl>

                            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500">Status:</dt>
                                <dd className="mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                    {order.status === 1 && (
                                        <svg
                                            className="me-1 h-3 w-3"
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
                                                d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                                            />
                                        </svg>
                                    )}
                                    {OrderStatus[order.status] || order.status}
                                </dd>
                            </dl>

                            <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                                <button
                                    type="button"
                                    className={`${order.status !== 1 ? "opacity-50 pointer-events-none" : ""} w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 lg:w-auto`}
                                    onClick={() => handleCancelOrder(order.id)}
                                >
                                    Cancel order
                                </button>
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 lg:w-auto"
                                    onClick={() => fetchMoreDetails(order.id)}
                                >
                                    View details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <OrderDetails orderDetails={orderDetails} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <FullScreenLoader loading={loading} />
        </div>
    );
}
