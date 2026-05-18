import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const res = await axios.post("http://localhost:3000/auth/register", {
                username: username,
                useremail: email,
                userpass: password
            });

            if (res.status === 201 || res.status === 200) {
                console.log("Success!", res.data);
                alert("Registration Successful!");
                navigate('/login');
            } else {
                console.log("Registration Failed");
                alert("Please Try Again");
            }
          
        } catch (error: any) {
            console.error("Failed:", error);
            const serverMessage = error.response?.data?.Message;
            alert(serverMessage || "Registration Failed! Please check your inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };   

    return (
        <div>
            <h1 className='text-center font-bold text-3xl m-5 '>Registration</h1>
            <form onSubmit={handleSubmit} className='border rounded flex shadow m-auto flex-col m-5 p-5 gap-3 w-100 max-w-md'>
                <label htmlFor="username">Username</label>
                <input 
                    type="text"  
                    id="username" 
                    className='border rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-300' 
                    onChange={(e) => setUsername(e.target.value)} 
                    required
                />

                <label htmlFor="email">Email</label>
                <input 
                    type="email"  
                    id="email" 
                    className='border rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-300' 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />

                <label htmlFor="password">Password</label>
                <input 
                    type="password"  
                    id="password" 
                    className='border rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-300' 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                <button 
                    type='submit' 
                    disabled={isSubmitting}
                    className='bg-green-200 rounded border hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>   
        </div>
    )
}

export default Register;