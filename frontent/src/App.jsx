import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./components/navigation/Nav"
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ResetPasswordPageConfirm from "./pages/ResetPasswordPageConfirm";
import ActivatePage from "./pages/ActivatePage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/navigation/PrivateRoute";
import Community from "./pages/Community";
import UserProfile from "./components/Account/UserProfile";
import TopicList from "./components/Post/TopicList";
import TopicContent from './components/Post/TopicContent'
import PostAndCommentList from "./components/Post/PostAndCommentList";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path="/home" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/community" element={<PrivateRoute element={<Community />} />}>
            <Route index element={<TopicList />} />
            <Route path=":subtopicId" element={<TopicContent />} />
            <Route path="/community/:lookupField/:lookupValue" element={<UserProfile />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
