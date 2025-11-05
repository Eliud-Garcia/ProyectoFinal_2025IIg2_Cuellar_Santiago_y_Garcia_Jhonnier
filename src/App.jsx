import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Landing_page from './Components/Landing_page/Landing_page'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard_reportero from './Components/Dashboard_reportero/Dashboard_reportero'
import Mis_noticiasR from './Components/Dashboard_reportero/Mis_noticias/Mis_noticias'
import CrearNoticia from './Components/Dashboard_reportero/CrearNoticia/CrearNoticia'
import Perfil from './Components/Dashboard_reportero/Perfil/Perfil'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing_page />} />
          <Route path="/dashboard_reportero" element={<Dashboard_reportero />} >
            <Route path='mis-noticias' element={<Mis_noticiasR />} />
            <Route path='crear-noticia' element={<CrearNoticia/>} />
            <Route path='perfil' element={<Perfil />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
