import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Community from './Community'
import Information from './Information'
import Profile from './Profile'
//import Login from "./login"
//import Register from "./register"


export default function Layout(){
  return (
    <nav className='page-container'>
      <div className='nav-content'>
          <a href="/Home"><img src="https://www.hamk.fi/wp-content/uploads/2023/09/HAMK-logo-desktop.svg" alt="" /></a>
          <a href="/Home">Home</a>
          <a href="/Community">Community</a>
          <a href="/Information">Information</a>
          <a href='/login'>Login</a>
          <a href='/register'>Register</a>
      </div>
      <div className='body-container'>
        <div className='left-nav-container'>
            <div className="left-nav-content">
              <a href="/Profile">Profile</a>
              <a href="/Community">Community</a>
              <a href="/Information">Information</a>
            </div>
        </div>
        
        <div className='main-container'>
            <div className="main-content">
              <Routes>
                <Route path="/Home" element = {<Home/>}/>
                <Route path="/Community" element = {<Community/>}/>
                <Route path="/Information" element = {<Information/>}/>
                <Route path="/Profile" element = {<Profile/>}/>
                
              </Routes>
            </div>
        </div>
        <div className='right-nav-container'>
            <div className='right-nav-content'>
              <a href="/Home">Home</a>
              <a href="/Community">Community</a>
              <a href="/Information">Information</a>
            </div>
            <div className='right-nav-content'>
              <a href="/Home">Home</a>
              <a href="/Community">Community</a>
              <a href="/Information">Information</a>
            </div>
            <div className='right-nav-content'>
              <a href="/Home">Home</a>
              <a href="/Community">Community</a>
              <a href="/Information">Information</a>
            </div>
        </div>
      </div>
    </nav>
  )
}
