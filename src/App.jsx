import { useState } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
//general
import Login from './Pages/Login/Login.jsx'
import Register from './Pages/Register/Register.jsx'
import Landing_page from './Pages/Landing_page/Landing_page.jsx'
import Header from './Components/Header/Header.jsx';
import Footer from './Components/Footer/Footer.jsx';

//proteccion rutas
import AccessDenied from './Components/AccessDenied/AccessDenied.jsx';

//reportero
import Dashboard_reportero from './Pages/Dashboard_reportero/Dashboard_reportero.jsx'
import Mis_noticiasR from './Pages/Dashboard_reportero/Mis_noticias/Mis_noticias.jsx'
import CrearNoticia from './Pages/Dashboard_reportero/CrearNoticia/CrearNoticia.jsx';
import Noticia from './Components/Noticia/Noticia.jsx';
import Seccion from './Pages/Secciones/Secciones.jsx'
import PanelNoticia from "./Pages/Panel_noticias/Panel_noticias.jsx"
import EditarNoticiaReportero from "./Pages/Dashboard_reportero/EditarNoticia/EditarNoticia.jsx";

//editor
import DashboardEditor from './Pages/DashboardEditor/DashboardEditor.jsx';
import GestionarNoticias from './Pages/DashboardEditor/GestionarNoticias/GestionarNoticias.jsx';
import GestionarSecciones from './Pages/DashboardEditor/GestionarSecciones/GestionarSecciones.jsx';
import EditarSeccion from './Pages/DashboardEditor/EditarSeccion/EditarSeccion.jsx';
import CrearSeccion from './Pages/DashboardEditor/CrearSeccion/CrearSeccion.jsx';
import EditarNoticia from './Pages/DashboardEditor/EditarNoticia/EditarNoticia.jsx';

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing_page />} />
          <Route path='/panel-noticias' element={<PanelNoticia />} />
          <Route path="/seccion/:nombre" element={<Seccion />} />
          <Route path="/noticia/:id" element={<Noticia />} />

          {/* Ruta para acceso denegado */}
          <Route path="/unauthorized" element={<AccessDenied />} />


          {/* Rutas protegidas para reportero */}

            <Route path="/dashboard-reportero" element={<Dashboard_reportero />}>
              <Route path="crear-noticia" element={<CrearNoticia />} />
              <Route path="mis-noticias" element={<Mis_noticiasR />} />
              <Route path="reportero-editar-noticia/:id" element={<EditarNoticiaReportero />} />
              
            </Route>

          {/* Rutas protegidas para editor */}
            <Route path="/dashboard-editor" element={<DashboardEditor />}>
              <Route path="listado-noticias" element={<GestionarNoticias />} />
              <Route path="listado-secciones" element={<GestionarSecciones />} />
              <Route path="crear-seccion" element={<CrearSeccion />} />
              <Route path="editar-seccion/:id" element={<EditarSeccion />} />
              <Route path="editar-noticia/:id" element={<EditarNoticia />} />
            </Route>

        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App