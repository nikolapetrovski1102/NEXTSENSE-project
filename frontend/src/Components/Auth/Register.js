import React, { useState } from 'react';
import Notification from '../Notification/Notification';
import { Axios } from '../Axios';
import { Cookie } from '../Cookie';

const axios = new Axios();
const cookie = new Cookie();

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(null);

    const handleSignUp = async () => {
        if (!username || !email || !phone || !fullName || !password) {
            setNotification({ message: 'Please fill in all fields', status: 'error' });
            return;
        }

        const registerData = {
            UserName: username,
            Email: email,
            Phone: phone,
            FullName: fullName,
            Password: password
        };

        axios.post('Auth/register', registerData)
            .then((response) => {
                if (response.status === 200) {
                    setNotification({ message: 'Registration successful', status: 'success' });
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    setNotification({ message: response.data, status: 'error' });
                }
            })
            .catch((error) => {
                console.error(error);
                setNotification({ message: 'Registration failed', status: 'error' });
            });
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
            <div className="flex justify-center">
                <div className="relative flex flex-col bg-white shadow-sm border border-gray-200 w-96 rounded-lg my-6">
                    <div className="relative m-2.5 items-center flex justify-center text-white h-24 rounded-md bg-blue-800">
                        <h3 className="text-2xl">Sign Up</h3>
                    </div>
                    <div className="flex flex-col gap-3 px-3 py-1">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2" />
                        <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2" />
                        <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2" />
                    </div>
                    <div className="p-6 pt-0">
                        <button className="w-full rounded-md bg-blue-800 py-2 px-2 text-white transition-all shadow-md hover:bg-blue-700 mt-2" type="button" onClick={handleSignUp}>
                            Sign Up
                        </button>
                        <p className="flex justify-center mt-6 text-sm text-gray-600">
                            Already have an account?
                            <a href="/" className="ml-1 text-sm font-semibold text-blue-700 underline">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
