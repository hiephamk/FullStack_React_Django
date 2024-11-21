import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'

const Nav = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }
    

    return (
        <nav className="navbar" style={{borderBottom:'2px solid #fff', fontSize: '24px'}}>
            {user ?
                <>  
                    <NavLink className="logo" to="/home">
                      <img style={{width:'auto',height:'30px'}} src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg" alt="logo" />
                    </NavLink>
                    <NavLink className='nav-childs' to="/home">Home</NavLink>
                    <NavLink className='nav-childs' to="/community">Communinty</NavLink>
                    <NavLink className='nav-childs' to="/" onClick={handleLogout}>Logout</NavLink>
                </>
                :
                <>
                    <NavLink className='nav-childs' to="/">Dashboard</NavLink>
                </>
            }
        </nav>
    )
}

export default Nav