
import { Route, Routes } from 'react-router-dom'

import CollaborativeEditor from './pages/CollaborativeEditor'

import Forum from './pages/Forum'
import Group from './pages/Group'
import Profile from './pages/Profile'
import type React from "react"
import { BrowserRouter as Router} from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import QuizesPage from './pages/QuizesPage'
import ModulePage from './pages/ModulePage'
import ModuleDocumentsPage from './pages/ModuleDocument'



const App = () => {
  return (

      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor" element={<CollaborativeEditor/>} />

        <Route path="/forum" element={<Forum />} />
        <Route path='/group'element={<Group/>}/>
        <Route path='/profile'element={<Profile/>}/>
        <Route path='/quizzes' element={<QuizesPage/>}/>
        <Route path='/subgroup' element={<ModulePage/>}/>
        <Route path='/doc' element={<ModuleDocumentsPage/>}/>
        
      </Routes>
      </div>

   
  )
}

export default App