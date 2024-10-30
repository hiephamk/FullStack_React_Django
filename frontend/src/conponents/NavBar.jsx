import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Community from './Community'
import Information from './Information'
import Profile from './Profile'
export default function NavBar(){
  return (
    <nav className='nav-container'>
      <ul className='nav-content'>
          <img src="https://www.hamk.fi/wp-content/uploads/2023/09/HAMK-logo-desktop.svg" alt="" />
          <a href="/Home">Home</a>
          <a href="/Community">Community</a>
          <a href="/Information">Information</a>
      </ul>
      <div className='body-container'>
        <ul className='left-nav-container'>
            <a href="/Profile">Profile</a>
            <a href="/Community">Community</a>
            <a href="/Information">Information</a>
        </ul>
        
        <div className='main-container'>
          <Routes>
            <Route path="/Home" element = {<Home/>}/>
            <Route path="/Community" element = {<Community/>}/>
            <Route path="/Information" element = {<Information/>}/>
            <Route path="/Profile" element = {<Profile/>}/>
          </Routes>
        </div>
        <ul className='right-nav-container'>
            <a href="/Home">Home</a>
            <a href="/About">About</a>
            <a href="/Information">Information</a>
        </ul>
      </div>
    </nav>
  )
}
