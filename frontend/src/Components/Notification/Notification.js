import React, { useState, useEffect } from "react";

export default function Notification({ message, status, onClose, onUndo }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose && onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className={`z-50 fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 text-white rounded-lg shadow-lg
            ${status === "success" ? "bg-green-500" : "bg-red-500"}`} role="alert">
            <div className="text-sm font-normal">{message}</div>
            <div className="flex items-center ms-auto space-x-2">
                {onUndo && (
                    <button 
                        className="text-sm font-medium bg-white text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200"
                        onClick={() => {
                            onUndo();
                            setIsVisible(false);
                        }}
                    >
                        Undo
                    </button>
                )}
                <button 
                    className="ms-auto bg-transparent text-white hover:text-gray-200 p-1 rounded-lg"
                    onClick={() => setIsVisible(false)}
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
