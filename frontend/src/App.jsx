import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./components/Nav"
import LoginPage from "./pages/Login"
//import Login from "./temp/Login"
import Home from './pages/Index'
import RegisterPage from "./pages/Register"
import ResetPasswordPage from "./pages/ResetPassword"
import ResetPasswordPageConfirm from "./pages/ResetPasswordConfirm";
import ActivatePage from "./pages/Activate";
import NotFoundPage from "./pages/NotFound";
import Layout from './pages/Layout'
import Profile from './pages/ProfileImg'
import Community from './pages/Community'
import Information from "./pages/Home";


function App() {

  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/home" element={<Layout />}>
            <Route index element={<Information />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="home/community" element={<Community />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

