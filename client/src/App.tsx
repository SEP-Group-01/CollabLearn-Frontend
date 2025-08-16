import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

import CollaborativeEditor from './pages/CollaborativeEditor'

import Forum from './pages/Forum'
import Group from './pages/Group'
import Profile from './pages/Profile'
import QuizesPage from './pages/QuizesPage'
import CreateQuiz from './pages/CreateQuiz'
import AttemptQuiz from './pages/AttemptQuiz'



const App = () => {
  return (
    <div>
    
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="/editor" element={<CollaborativeEditor/>} />

        <Route path="/forum" element={<Forum />} />
        <Route path='/group'element={<Group/>}/>
        <Route path='/profile'element={<Profile/>}/>
        <Route path='/quizzes' element={<QuizesPage/>}/>
        <Route path='/create-quiz' element={<CreateQuiz/>}/>
        <Route path='/attempt-quiz' element={<AttemptQuiz/>}/>



      </Routes>
    
    </div>
   
  )
}

export default App