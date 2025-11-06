import { useState } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login.jsx'
import Register from './Pages/Register/Register.jsx'
import Landing_page from './Pages/Landing_page/Landing_page.jsx'
import Dashboard_reportero from './Pages/Dashboard_reportero/Dashboard_reportero.jsx'
import Mis_noticiasR from './Pages/Dashboard_reportero/Mis_noticias/Mis_noticias.jsx'
import Perfil from './Pages/Dashboard_reportero/Perfil/Perfil.jsx'
import CrearNoticia from './Pages/Dashboard_reportero/CrearNoticia/CrearNoticia.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Header from './Components/Header/Header.jsx';

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing_page />} />
          <Route path='/dashboard-reportero' element={<Dashboard_reportero />} />
          <Route path='/dashboard-reportero/mis-noticias' element={<Mis_noticiasR />} />
          <Route path='/dashboard-reportero/crear-noticia' element={<CrearNoticia />} />
          <Route path='/dashboard-reportero/perfil' element={<Perfil />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
