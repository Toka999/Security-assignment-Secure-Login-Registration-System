import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <nav className=' flex bg-blue-950 flex-row justify-between p-5 shadow'>
      <div className="Logo font-bold text-3xl text-green-200 ">LOGO</div>
      <div className='Details'>
      <ul className='text-blue-100 flex flex-row gap-4 cursor-pointer'>
        
        
        
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
      </div>
    </nav>
  )
}
export default Navbar