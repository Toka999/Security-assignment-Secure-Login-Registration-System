import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='border w-100 p-5 flex flex-col m-auto rounded mt-5 gap-10'>
            <h1 className='font-bold text-center'>WELCOME TO HOME SCREEN</h1>
            <div className='flex flex-row gap-45 ms-5'>
                <Link to="/register">
                    <button className='bg-green-200 rounded border hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer'>Register</button>
                </Link>
                <Link to="/login">
                    <button className='bg-green-200 rounded border hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer'>Login</button>
                </Link>
                
                
            </div>
        </div>
        
      
    </div>
  )
}

export default Home
