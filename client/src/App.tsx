import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Forum from './pages/Forum'


const App = () => {
  return (
    <div>
    
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/forum" element={<Forum />} />

      </Routes>
    
    </div>
   
  )
}

export default App