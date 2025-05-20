import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register' 
import Exercicios from './Pages/Exercicios'
import Alimentacao from './Pages/Alimentacao';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Exercicios" element={<Exercicios />} />
        <Route path="/Alimentacao" element={<Alimentacao />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
