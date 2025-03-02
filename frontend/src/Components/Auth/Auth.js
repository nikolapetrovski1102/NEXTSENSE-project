
import React, { useEffect, useState} from 'react'
import Notification from '../Notification/Notification';

import { Axios } from '../Axios'
import { Cookie } from '../Cookie';

const axios = new Axios();
const cookie = new Cookie();

export default function Auth () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect( () => {
        if (cookie.getCookie('access_token')) {
            window.location.href = '/products';
        }
    })

    const handleSignIn = async () => {
        if (!email || !password) {
            setNotification({ message: 'Please enter email and password', status: 'error' });
            return;
        }

        const loginData = {
            email,
            password,
            rememberMe
        };

        axios.post('Auth/login', loginData).then((response) => {
            console.log(response);
            if (response.status === 200) {
                const token = response.data.access_token;
                if (token) {
                    
                    cookie.setCookie('access_token', token, response.data.valid_to);
                    setNotification({ message: 'Login successful', status: 'success' });
                    setTimeout(() => {
                        window.location.href = '/products';
                    }, 1000);
                }else
                    setNotification({ message: response.data, status: 'error' });
            }
        })
        .catch((error) => {
            console.error(error);
            setNotification({ message: 'Login failed', status: 'error' });
        });

    };


    return(
        <div>
        {notification && (
            <Notification 
                message={notification.message} 
                status={notification.status} 
                onClose={() => setNotification(null)} 
            />
        )}
        <div className="flex justify-center m-10">
            <div className="relative flex flex-col bg-salte-100 shadow-sm border border-slate-200 w-96 rounded-lg my-6">
                <div className="relative m-2.5 items-center flex justify-center text-white h-24 rounded-md bg-slate-800">
                    <h3 className="text-2xl">Sign In</h3>
                </div>
                <div className="flex flex-col gap-4 p-6">
                    <div className="w-full max-w-sm min-w-[200px]">
                        <label className="block mb-2 text-sm text-slate-600">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                            placeholder="Your Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="w-full max-w-sm min-w-[200px]">
                        <label className="block mb-2 text-sm text-slate-600">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                            placeholder="Your Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="inline-flex items-center mt-2">
                        <input 
                            type="checkbox" 
                            className="h-5 w-5 cursor-pointer border border-slate-300 checked:bg-slate-800" 
                            id="rememberMe" 
                            checked={rememberMe} 
                            onChange={() => setRememberMe(!rememberMe)} 
                        />
                        <label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor="rememberMe">
                            Remember Me
                        </label>
                    </div>
                </div>
                <div className="p-6 pt-0">
                    <button 
                        className="w-full rounded-md bg-slate-800 py-2 px-4 text-white transition-all shadow-md hover:bg-slate-700"
                        type="button"
                        onClick={handleSignIn}
                    >
                        Sign In
                    </button>
                    <p className="flex justify-center mt-6 text-sm text-slate-600">
                        Don&apos;t have an account?
                        <a href="#signup" className="ml-1 text-sm font-semibold text-slate-700 underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
        </div>
    )
}
