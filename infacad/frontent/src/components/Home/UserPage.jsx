import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../features/auth/token'
import ProfileImg from '../ProfileImg'
import axios from 'axios'
import { toast } from 'react-toastify'
import Notifications from '../Topic/Notifications'

const UserPage = () => {
  const {user, userInfo } = useSelector((state) => state.auth)
  const accessToken = useAccessToken(user)

  const [users, setUsers] = useState([])

  useEffect(()=>{
    const fetchUserInfo = async () => {
      if (!accessToken) {
        toast.error('Please Login again!');
        return;
      }
      const url1 = `http://127.0.0.1:8000/api/account/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };
      try {
  
        const resp1 = await axios.get(url1, config)
  
        const account = resp1.data.filter((account) => account.user == userInfo.id)
        setUsers(account)
      } catch (error) {
        
        console.error('Error fetching topics/subtopics:', error.response || error.message);
      }
    };
    if(user?.access){

      fetchUserInfo()
    }
  },[accessToken,userInfo.id, user])

  const renderProfileImage = (profile_img) => {
    
    if (profile_img) {
      const fileExtension = profile_img.split('.').pop().toLowerCase();
      const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
      if (imageFormats.includes(fileExtension)) {
        return (
            <>
              <img
                src={`${profile_img}`}
                alt="Post text"
                style={{ width: '40px', height: '40px', borderRadius:'40px' }}
              />
            </>
        );
      }
    }
  }
  return (
    <div>
      <Notifications/>
      <h3>{userInfo.first_name} {userInfo.last_name}</h3>
      <p>email: {userInfo.email}</p>
      {
        users.map((user) => (
          <div key={user.id}>
            <p>Birth date: {user.birth_date}</p>
            <h5>About me</h5>
            <p>{user.aboutMe}</p>
            <div>
              <h5>Profile Image:</h5>
              {renderProfileImage(user.profile_img)}
            </div>

          </div>
        ))
      }

      <div>

      </div>
    </div>
  )
}

export default UserPage