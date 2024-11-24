import React from 'react'
import { useSelector } from 'react-redux'
import ProfileImg from '../components/profileImg'
import CreateTopic from '../components/Topic/CreateTopic'
import UserProfile from '../components/Account/UserProfile'



const Dashboard = () => {

    const { userInfo } = useSelector((state) => state.auth)


    return (
        <div className='page-container'>
            <div className='left-container'>
              <div style={{borderBottom:'2px solid #1113'}}>
                <ProfileImg/>
                <p>{userInfo.id}{userInfo.first_name} {userInfo.last_name}</p>
              </div>
            </div>
            <div className="main-container">
              <div>
                <CreateTopic/>
              </div>
              <UserProfile/>
              <div>
                {/* <AccountDetails/> */}
              </div>
            </div>
            <div className='right-container'>
              <h1>this is right</h1>
            </div>
        </div>
    )
}

export default Dashboard