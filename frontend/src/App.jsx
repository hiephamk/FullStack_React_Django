
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Register from './auth/Register';
import Login from './auth/Login';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
//import NotFound from './pages/NotFound';
import { AuthContext } from './context/AuthContext';
import Community from './pages/Community';

function App() {
  const { auth } = useContext(AuthContext); // Retrieve auth state from context

  return (
    <Router>
        <Routes>
        {/* Route for Login Page */}
            <Route path="/" element={auth ? <Navigate to="/home" /> : <Login/>} />
            <Route path="/register" element={<Register />} /> 
        {/* Protected Route for Layout Page */}
             <Route path="/home/*" element={auth ? <Layout /> : <Navigate to="/" />} >
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
            </Route> 
              <Route path="home/community" element={<Community />} />
        </Routes>
    </Router>
  );
}

export default App;

