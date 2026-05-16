import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();
  const submitHandler=async(e:React.SubmitEvent)=>{
    e.preventDefault();
    try{
      const res =await axios.post("http://localhost:3000/auth/login",{
        username:username,

        userpass:password
      });
      if(res.status === 200){
        console.log ("Login Success!", res.data);
        alert("Welcome back");
        navigate('/Home');
      }else if(res.status===400){
        console.log ("Login failed!");
        alert("Wrong inputs, please try again");

      }else{
        console.log ("Login Failed");
        alert("Please Try Again");
      }
    }catch(error){console.log(error);}


  }
  return (
    <>
        <h1 className='text-center m-5 font-bold text-3xl'>welcome, Please Login</h1>
        <form onSubmit={submitHandler} className='border w-100 p-5 flex flex-col m-auto rounded' method='post'>
            <label htmlFor="username">Username:</label>
            <input type="text"
             className='border rounded' 
             id="username"
             value={username}
             onChange={(e)=>{setUsername(e.target.value)}}/>

            <label htmlFor="password">Password</label>
            <input type="password"
             id="password"
              className='border rounded'
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}/>

            <button type='submit' className='bg-green-200 mt-5 border font-bold py-1 hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer '>Login</button>
        </form>
    </>
    
  )
}

export default Login
