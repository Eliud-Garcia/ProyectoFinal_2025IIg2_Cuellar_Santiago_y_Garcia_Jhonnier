import { useState } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
//general
import Login from './Pages/Login/Login.jsx'
import Register from './Pages/Register/Register.jsx'
import Landing_page from './Pages/Landing_page/Landing_page.jsx'
import Header from './Components/Header/Header.jsx';
import Footer from './Components/Footer/Footer.jsx';

//reportero
import Dashboard_reportero from './Pages/Dashboard_reportero/Dashboard_reportero.jsx'
import Mis_noticiasR from './Pages/Dashboard_reportero/Mis_noticias/Mis_noticias.jsx'
import CrearNoticia from './Pages/Dashboard_reportero/CrearNoticia/CrearNoticia.jsx';

//editor
import DashboardEditor from './Pages/DashboardEditor/DashboardEditor.jsx';
import GestionarNoticias from './Pages/DashboardEditor/GestionarNoticias/GestionarNoticias.jsx';
import GestionarSecciones from './Pages/DashboardEditor/GestionarSecciones/GestionarSecciones.jsx';
import EditarSeccion from './Pages/DashboardEditor/EditarSeccion/EditarSeccion.jsx';
const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Landing_page />} />

          <Route path="/dashboard-reportero" element={<Dashboard_reportero />}>
            <Route path="crear-noticia" element={<CrearNoticia />} />
            <Route path="mis-noticias" element={<Mis_noticiasR />} />
          </Route>

          <Route path="/dashboard-editor" element={<DashboardEditor />}>
            <Route path="listado-noticias" element={<GestionarNoticias />} />
            <Route path="listado-secciones" element={<GestionarSecciones />} />
            <Route path="editar/:id" element={<EditarSeccion />} />
          </Route>

        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
