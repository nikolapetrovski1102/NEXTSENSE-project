import react, { useEffect, useState } from "react"
import { Cookie } from "../Cookie"

const cookie = new Cookie();

export default function Layout({ children, title }) {
    const [cartItemCount, setCartItemCount] = useState(0);
   
    const handleLogOut = () => {
        cookie.deleteCookie("access_token");
        window.location.href = '/';
    }
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        setCartItemCount(totalItems);
    }, []); 

    return (
        <div className="min-h-full">
            <div className="bg-gray-800 h-[50dvh]" >
                <nav className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                            <a onClick={(e) => { e.preventDefault(); handleLogOut(); }} href="#" className={`rounded-md ${title === "Login" ? "bg-gray-900" : ""} px-3 py-2 text-sm font-medium text-gray-300`} aria-current="page">{title === "Login" ? "Login" : <span className="text-red-400" >Logout</span>}</a>
                            <a href={`${title === "Products" ? "#" : "/products"}`} className={`rounded-md ${ title === "Products" ? "bg-gray-900" : ""} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white ${ title === "Login" ? "opacity-40 pointer-events-none" : ""} `}>Products</a>
                            <a href={`${title === "My orders" ? "#" : "/orders"}`} className={`rounded-md ${ title === "My orders" ? "bg-gray-900" : ""} px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white ${ title === "Login" ? "opacity-40 pointer-events-none" : ""} `}>My orders</a>
                            </div>
                        </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                            <button
                type="button"
                className={`${title === "Cart" ? "bg-gray-900" : ""} relative flex items-center justify-center rounded-full bg-gray-800 p-2 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800`}
            >
                <a href="/cart">
                    <svg fill="white" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 32 32">
                        <g id="cart">
                            <path className="cls-1" d="M29.46,10.14A2.94,2.94,0,0,0,27.1,9H10.22L8.76,6.35A2.67,2.67,0,0,0,6.41,5H3A1,1,0,0,0,3,7H6.41a.68.68,0,0,1,.6.31l1.65,3,.86,9.32a3.84,3.84,0,0,0,4,3.38H23.89a3.92,3.92,0,0,0,3.85-2.78l2.17-7.82A2.58,2.58,0,0,0,29.46,10.14ZM28,11.86l-2.17,7.83A1.93,1.93,0,0,1,23.89,21H13.48a1.89,1.89,0,0,1-2-1.56L10.73,11H27.1a1,1,0,0,1,.77.35A.59.59,0,0,1,28,11.86Z"/>
                            <circle className="cls-1" cx="14" cy="26" r="2"/>
                            <circle className="cls-1" cx="24" cy="26" r="2"/>
                        </g>
                    </svg>
                    {/* Display the item count on top of the cart */}
                    {cartItemCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {cartItemCount}
                        </span>
                    )}
                </a>
            </button>
                                <div className="relative ml-3">
                                    <button type="button" className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="-mr-2 flex md:hidden">
                            <button type="button" className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    </div>
                </nav>

                <hr className="h-px m-auto w-[90%] bg-gray-200 border-0 dark:bg-gray-700" />

                <header className="shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                    </div>
                </header>
                <main>
                    <div className="shadow-lg mx-auto max-w-[80%] w-auto pr-4 py-1 sm:pr-6 lg:pr-8 border border-solid rounded-lg bg-white h-fit">
                        <div className="h-full" >
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}