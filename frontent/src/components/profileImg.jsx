import { useEffect, useState } from "react";
import axios from 'axios';
import { ImProfile } from "react-icons/im";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import useAccessToken from "../features/auth/token";


const ProfileImg = () => {
  const [profileImg, setProfileImg] = useState('');
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user)

    useEffect(() => {

        const fetchProfileImg = async () => {
          if(!accessToken) {
            console.error('cannot get accessToken');
            return;
          }
          const url = `http://127.0.0.1:8000/api/account/`
          const config = {
            headers:{
              Authorization: `Bearer ${accessToken}`,
            },
          }
        try {
          const response = await axios.get(url,config)
          if (response.data.length > 0) {
            const userProfile = response.data.find(profile => profile.user === userInfo.id);
            if (userProfile) {
              setProfileImg(userProfile.profile_img); // Set the image URL for the current user
            } else {
              console.error("User profile image not found");
            }
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };
      if (accessToken) {
        fetchProfileImg();
      }
    }, [userInfo.id, accessToken]);
  
  return (
    <>
    {user ?
      <div>
        {profileImg ?
          (
            <img style={{width:'50px', height:'50px',borderRadius:'40px' }} src={profileImg} alt="User Profile" />
          )
          :
          (
            <ImProfile />
        )}
      </div>
      :
      <Link to='/login'>login</Link>
  }
    </>
  );
};

export default ProfileImg;
