import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./navigation/Nav"
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register"
import ResetPasswordPage from "./pages/ResetPassword"
import ResetPasswordPageConfirm from "./pages/ResetPasswordConfirm";
import ActivatePage from "./pages/Activate";
import NotFoundPage from "./pages/NotFound";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Nav from "./navigation/Nav";
// import HomePage from "./pages/HomePage";
// import Dashboard from "./pages/Dashboard.jsx";
// import LoginPage from "./pages/Login.jsx";
// import RegisterPage from "./pages/Register.jsx";
// import ResetPasswordPage from "./pages/ResetPassword.jsx";
// import ResetPasswordPageConfirm from "./pages/ResetPasswordConfirm.jsx";
// import ActivatePage from "./pages/Activate.jsx";
// import NotFoundPage from "./pages/NotFound";
// import PrivateRoute from "./navigation/PrivateRoute.jsx";


// function App() {
//   return (
//     <>
//       <Router>
//         <Nav />
//         <Routes>
//         <Route path="/" element={<PrivateRoute element={<HomePage />}/>} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />}/>
//           <Route path="/activate/:uid/:token" element={<ActivatePage />} />
//           <Route path="/reset-password" element={<ResetPasswordPage />} />
//           <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
//           <Route path="*" element={<NotFoundPage />} />
//           <Route path="/home" element={<PrivateRoute element={<Dashboard />} />} />
//         </Routes>
//       </Router>
//       <ToastContainer />
//     </>
//   );
// }

// export default App;
