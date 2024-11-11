import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../auth/authSlice'
import { toast } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'


const Dashboard = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo } = useSelector((state) => state.auth)
    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }
    return (
        <nav className='page-container'>
          <div className='nav-content'>
              <Link to="/home"><img src="https://www.hamk.fi/wp-content/uploads/2023/09/HAMK-logo-desktop.svg" alt="" /></Link>
              <Link to="/home">Home</Link>
              <Link to="/home/info">Information</Link>
              <h1>Welcome, {userInfo.first_name} {userInfo.last_name} </h1>
              <Link to="/home/community">Community</Link>
              <Link className='nav-childs' to="/" onClick={handleLogout}>Logout</Link>



          </div>
          <div className='body-container'>
            <div className='left-nav-container'>
                <div className="left-nav-content">
                  <Link to="/home/profile">Profile</Link>
                  <Link to="/home/community">Community</Link>
                  <Link to="/home/info">Information</Link>
                </div>
            </div>
            
            <div className='main-layout-container'>
                <div className="main-layout-content">
                    <Outlet/>
                </div>
            </div>
            <div className='right-nav-container'>
                <div className='right-nav-content'>
                  <Link to="/Home">Home</Link>
                  <Link to="/home/community">Community</Link>
                  <Link to="/home/info">Information</Link>
                </div>

            </div>
          </div>
        </nav>
      )
    }

export default Dashboard