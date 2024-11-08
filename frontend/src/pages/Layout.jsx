import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function Layout() {
  const { logout, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/')
  }
  return (
    <div className="page-container">
      {/* Top Navigation Bar */}
      <div className="nav-content">
        <Link to="/home">
          <img src="https://www.hamk.fi/wp-content/uploads/2023/09/HAMK-logo-desktop.svg" alt="Logo" />
        </Link>
        <Link to="/home">Home</Link>
        <Link to="/home/profile">Profile</Link>
        <Link to="/home/news">News</Link>
        {/* <Link to="/home/community">Community</Link> */}
        <a href="/home/community">Community</a>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Body Container */}
      <div className="body-container">
        {/* Left Navigation Sidebar */}
        <div className="left-nav-container">
          <div className="left-nav-content">
            <Link to="/home/profile">Profile</Link>
            <Link to="/home/community">Community</Link>
            <Link to="/home/create-post">Create Post</Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-container">
          <div className="main-content">
          {username ? <h2>Welcome, {username}!</h2> : <h2>Welcome, Guest!</h2>}
            <Outlet/> {/* Renders the selected nested route */}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-nav-container">
          <div className="right-nav-content">
            <Link to="/home/">Home</Link>
            <Link to="/home/community">Community</Link>
            <Link to="/home/information">Information</Link>
          </div>
          <div className="right-nav-content">
            <Link to="/home/home">Home</Link>
            <Link to="/home/community">Community</Link>
            <Link to="/home/information">Information</Link>
          </div>
          <div className="right-nav-content">
            <Link to="/home">Home</Link>
            <Link to="/home/community">Community</Link>
            <Link to="/home/information">Information</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
