import React from "react";
import { OrderStatus } from "../OrderStatus";

export default function OrderDetails({ isOpen, onClose, orderDetails }) {
    if (!isOpen) return null;

    const { order, order_details } = orderDetails;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Order <strong>#{order.id}</strong> Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 rounded-lg p-2">
                        ✕
                    </button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4" >
                        <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ${order.orderTotal}</p>
                        <p><strong>Status:</strong> {OrderStatus[order.status] || "Unknown"}</p>
                        <p><strong>Customer:</strong> {order.orderCustomerFullname}</p>
                        <p><strong>Address:</strong> {order.orderAddress}</p>
                        <p><strong>Phone:</strong> {order.orderCustomerPhone}</p>
                    </div>
                    <hr className="my-4" />

                    <div>
                        <h4 className="text-lg font-medium">Order Items</h4>
                        <ul className="ml-4">
                            {order_details.map((item, index) => (
                                <li key={index} className="py-2 border-b">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Product: {item.product?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 ml-3">
                                        <span>Product ID: {item.productId}</span>
                                        <span>Quantity: {item.quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 ml-3">
                                        <span>Price: ${item.product?.price}</span>
                                        <span>Manufacturer: {item.product?.manufacturer}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 ml-3">
                                        <span>Available Stock: {item.product?.quantity}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t border-gray-200">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
