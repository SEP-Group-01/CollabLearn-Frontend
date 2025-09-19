import { Route, Routes } from 'react-router-dom'

import CollaborativeEditor from './pages/CollaborativeEditor'
import Header from "./components/Header";

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
import GroupListPage from './pages/GroupListPage'
import StudyPlanGenerationPage from './pages/StudyPlanGenerationPage'
import GroupManagePage from './pages/GroupManagePage';
import DocumentDetailsPage from './pages/DocumentDetailsPage';

const dummyUser = {
  name: "Student Name",
  avatarUrl: "https://i.pravatar.cc/150?img=3", // or your user's avatar url
};

const App = () => {
  return (

      <div className="App">
      {/* <Header user={dummyUser} /> Pass user prop here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          <Route path="/editor" element={<CollaborativeEditor />} />
          <Route path="/workspaces-list" element={<GroupListPage />} />
          <Route path="/workspaces-list/:search" element={<GroupListPage />} />

          <Route path="/forum" element={<Forum />} />
          <Route path="/workspace/:workspaceId" element={<Workspace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quizzes" element={<QuizesPage />} />
          <Route path="/study-plan" element={<StudyPlanGenerationPage />} />

          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/attempt-quiz" element={<AttemptQuiz />} />

          {/* Thread-based routes */}
          <Route path="/workspace/:workspaceId/threads/:threadId" element={<ThreadPage />} />
          <Route path="/workspace/:workspaceId/threads/:threadId/documents" element={<ThreadDocumentsPage />} />
          <Route path="/workspace/:workspaceId/threads/:threadId/documents/:docId" element={<DocumentDetailsPage />} />
          <Route path="/workspace/:workspaceId/threads/:threadId/query" element={<DocumentQuery />} />
          <Route path="/workspace/:workspaceId/threads/:threadId/manage" element={<GroupManagePage />} />

          {/* Remove old module-based routes */}
        </Routes>
      </div>

   
  )
}

export default App