import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import { FiAlignJustify } from "react-icons/fi";
import Dropdown from 'react-bootstrap/Dropdown';
import ProfileImg from '../ProfileImg';
// import { toast } from 'react-toastify'

const Nav = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, userInfo } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }
    

  return (
    <nav className="navbar" style={{borderBottom:'2px solid #fff', fontSize: '24px'}}>
      <NavLink className="logo" to="/home">
        <img style={{width:'auto',height:'30px'}} src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg" alt="logo" />
      </NavLink>
      <NavLink className='nav-childs' to="/home">Home</NavLink>
      <NavLink className='nav-childs' to="/home/channels">Video</NavLink>
      <NavLink className='nav-childs' to="/home/publiczone">Public Zone</NavLink>
      <div className='dropstart'>
        <button data-bs-toggle="dropdown">
          <ProfileImg/>
        </button>
        <ul className='dropdown-menu px-2 mx-2'>
          <li className='d-flex flex-column'>
            <NavLink to='/home/profile'>Profile</NavLink>
          </li>
          <li>
            <NavLink to="/" onClick={handleLogout}>Logout</NavLink>
          </li>
        </ul>
      </div>

    </nav>
  )
}

export default Nav