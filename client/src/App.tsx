import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

import CollaborativeEditor from './pages/CollaborativeEditor'

import Forum from './pages/Forum'
import Group from './pages/Group'
import Profile from './pages/Profile'



const App = () => {
  return (
    <div>
    
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="/editor" element={<CollaborativeEditor/>} />

        <Route path="/forum" element={<Forum />} />
        <Route path='/group'element={<Group/>}/>
        <Route path='/profile'element={<Profile/>}/>



      </Routes>
    
    </div>
   
  )
}

export default App