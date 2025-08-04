import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CollaborativeEditor from './pages/CollaborativeEditor'


const App = () => {
  return (
    <div>
    
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/editor" element={<CollaborativeEditor/>} />
      </Routes>
    
    </div>
   
  )
}

export default App