import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
// import { toast } from 'react-toastify'

const NavPublic = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, userInfo } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/home/publiczone")
    }
    

  return (
    <>
      {user ?(
        <nav className="navbar" style={{borderBottom:'2px solid #fff', fontSize: '24px'}}>
          <NavLink className="logo" to="/home">
          <img style={{width:'auto',height:'30px'}} src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg" alt="logo" />
          </NavLink>
          <NavLink to='/home/profile'><p>{userInfo.first_name} {userInfo.last_name}</p></NavLink>
          <NavLink className='nav-childs' to="/home">Home</NavLink>
          <NavLink className='nav-childs' to="/home/publiczone">Public Zone</NavLink>
          <div style={{display:'flex'}}>
            <NavLink className='nav-childs' to="/home/publiczone" onClick={handleLogout}>Logout</NavLink>
          </div>
        </nav>
      ):(
      <nav className="navbar" style={{borderBottom:'2px solid #fff', fontSize: '24px'}}>
        <NavLink className="logo" to="/home">
          <img style={{width:'auto',height:'30px'}} src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg" alt="logo" />
        </NavLink>
        <NavLink to='/home/profile'><p>{userInfo.first_name} {userInfo.last_name}</p></NavLink>
        <NavLink className='nav-childs' to="/home">Home</NavLink>
        <NavLink className='nav-childs' to="/home/publiczone">Public Zone</NavLink>
        <div style={{display:'flex'}}>
          <NavLink className='nav-childs' to="/login" onClick={handleLogout}>Login</NavLink>
        </div>
      </nav>
    )}
  </>
  )
}

export default NavPublic