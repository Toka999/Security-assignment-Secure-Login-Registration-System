import { useState } from 'react'
import Login from './Components/LoginForm/Login'
import {BrowserRouter, Routes,Route } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Register from './Components/RegisterForm/Register'
import Home from './Components/Homepage/Home'
import Def from './Components/Def/Def'
import './App.css'
import ProductCard from './Components/ProductCard/ProductCard.tsx'

function App() {

interface Routings{
path:string
element:React.ReactNode
}

const paths:Routings[]=[
    {path:"/",element:<Def></Def>},
    {path:"/Home",element:<Home></Home>},
    {path:"/register",element:<Register/>},
    {path:"/Login",element:<Login></Login>},
    {path:"/Product",element:<ProductCard/>}
  ];
  

  return (
    <>
    
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          {
           paths.map((ele,index)=>(<Route key={index} path={ele.path} element={ele.element} ></Route>))
          }
        </Route>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
