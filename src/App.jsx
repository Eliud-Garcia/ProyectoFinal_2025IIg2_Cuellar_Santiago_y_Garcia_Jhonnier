import { useState } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Landing_page from './Components/Landing_page/Landing_page'
import Dashboard_reportero from './Components/Dashboard_reportero/Dashboard_reportero'
import Mis_noticiasR from './Components/Dashboard_reportero/Mis_noticias/Mis_noticias'
import Perfil from './Components/Dashboard_reportero/Perfil/Perfil'
import CreateNewsPage from './Pages/CreateNewsPage/CreateNewsPage.jsx';7
import PanelNoticia from "./Components/Panel_noticias/Panel_noticias.jsx"
import Noticia from './Components/Noticia/Noticia.jsx';
import Seccion from './Components/Secciones/Secciones.jsx'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing_page />} />
          <Route path='/panel-noticias' element={<PanelNoticia/>}/>
          <Route path="/seccion/:nombre" element={<Seccion/>} />
          <Route path="/seccion" element={<Seccion/>} />
          <Route path="/noticia/:id" element={<Noticia/>} />
          <Route path="/noticia" element={<Noticia/>} />
          <Route path="/dashboard_reportero" element={<Dashboard_reportero />} >
            <Route path='mis-noticias' element={<Mis_noticiasR />} />
            <Route path='crear-noticia' element={<CreateNewsPage />} />
            <Route path='perfil' element={<Perfil />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
