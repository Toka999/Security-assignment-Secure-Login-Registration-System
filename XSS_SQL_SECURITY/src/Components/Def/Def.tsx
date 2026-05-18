import React from 'react'
import { Link } from 'react-router-dom'

const Def = () => {
  return (
    <div>
        <h1 className='text-center font-bold text-5xl mt-20'>Use Buttons to Navigate</h1>
        <div className='flex flex-row gap-45 border w-200 p-5 ps-15 ms-80 mt-20'>
                <Link to="/register">
                    <button className='bg-green-200 rounded border hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer'>Register</button>
                </Link>
                <Link to="/login">
                    <button className='bg-green-200 rounded border hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer'>Login</button>
                </Link>
                <Link to="/Product">
                    <button className='bg-green-200 rounded border hover:bg-white font-bold p-3 hover:text-green-300 hover:cursor-pointer'>Buy Product</button>
                </Link> 
          </div>
      
    </div>
  )
}

export default Def
