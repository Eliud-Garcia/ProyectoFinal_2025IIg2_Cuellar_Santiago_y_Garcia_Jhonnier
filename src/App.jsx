import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CreateNewsPage from './Pages/CreateNewsPage/CreateNewsPage.jsx';
const App = () => {
  return (
    <>
      
      <Router>
        <Routes>
          <Route path='/create' element={<CreateNewsPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
