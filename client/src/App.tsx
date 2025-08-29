
import { Route, Routes } from 'react-router-dom'

import CollaborativeEditor from './pages/CollaborativeEditor'

import Forum from './pages/Forum'
import Workspace from './pages/Workspace'
import Profile from './pages/Profile'
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
// import DashboardPage from "./pages/DashboardPage"
import QuizesPage from './pages/QuizesPage'

import CreateQuiz from './pages/CreateQuiz'
import AttemptQuiz from './pages/AttemptQuiz'

import ThreadPage from './pages/ThreadPage'
import ThreadDocumentsPage from './pages/ThreadDocument'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DocumentQuery from './pages/DocumentQuery'




const App = () => {
  return (

      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          <Route path="/editor" element={<CollaborativeEditor/>} />

        <Route path="/forum" element={<Forum />} />
        <Route path='/workspace'element={<Workspace/>}/>
        <Route path='/profile'element={<Profile/>}/>
        <Route path='/quizzes' element={<QuizesPage/>}/>

        <Route path='/create-quiz' element={<CreateQuiz/>}/>
        <Route path='/attempt-quiz' element={<AttemptQuiz/>}/>

        <Route path='/thread' element={<ThreadPage/>}/>
        <Route path='/doc' element={<ThreadDocumentsPage/>}/>
        <Route path='/query' element={<DocumentQuery/>}/>


      </Routes>
      </div>

   
  )
}

export default App