import React from 'react'
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        username: username,
        useremail: email,
        userpass: password
      });

      console.log("Success!", res.data);
      alert("Registration Successful!");
      navigate('/login');
      
    } catch (error) {
      console.error("Failed:", error);
      alert("Registration Failed! Check your server console.");
    }
  };  
    return (
        <div>
            <h1 className='text-center font-bold text-3xl m-5 '>Registeration</h1>
            <form onSubmit={handleSubmit}  className='border rounded flex shadow m-auto  flex-col m-5 p-5 gap-3 w-100 '>
                <label htmlFor="username">Username</label>
                <input type="text"  id="username" className='border rounded' onChange={(e) => setUsername(e.target.value)} 
            required/>

                <label htmlFor="email">Email</label>
                <input type="email"  id="email" className='border rounded' onChange={(e) => setEmail(e.target.value)} 
            required/>

                <label htmlFor="password">Password</label>
                <input type="password"  id="password" className='border rounded 'onChange={(e) => setPassword(e.target.value)} 
            required />

                <button type='submit' className='bg-green-200 rounded border hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer'  >Submit</button>
            </form>  
        </div>
    )
}

export default Register
