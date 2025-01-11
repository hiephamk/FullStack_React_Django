import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../features/auth/token'
//import ProfileImg from '../ProfileImg'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

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
  
        const account = resp1.data.filter((account) => account.user === userInfo.id)
        setUsers(account)
      } catch (error) {
        
        console.error('Error fetching topics/subtopics:', error.response || error.message);
      }
    };
    if(user?.access){

      fetchUserInfo()
    }
  },[accessToken,userInfo.id])

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
                className='rounded-circle'
                style={{width:'75px', height:'75px'}}
              />
            </>
        );
      }
    }
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div>
      <div className='userprofile-container'>
        {
          users.length > 0 ? users.map((user) => (
            <div key={user.id} className='userprofile-content'>
              <div className='userprofile-img'>
                {renderProfileImage(user.profile_img)}
              </div>
              <div className='userprofile-text'>
                <h3>{userInfo.first_name} {userInfo.last_name}</h3>
                <p>Phone Number: {user.phoneNumber}</p>
                <p>email: {userInfo.email}</p>
                <p>Birth date: {formatDate(user.birth_date)}</p>
                <p>About me: </p>
                <p>{user.aboutMe}</p>
                <Link to = '/home/account'>Update Account</Link>
              </div>
            </div>
          ))
          :
          <div style={{padding:'20px', display:'flex'}}>
            <p style={{paddingRight:'10px'}}>Please update your information!</p>
            <Link to = '/home/account'>Update profile</Link>
          </div>
        }
      </div>
    </div>
  )
}

export default UserPage