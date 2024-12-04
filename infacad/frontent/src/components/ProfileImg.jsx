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
      if (!accessToken || !userInfo?.id) {
        console.error("Access token or user information is not available");
        return;
      }
      const url = "http://127.0.0.1:8000/api/account/";
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      try {
        const response = await axios.get(url, config);
        console.log("API Response:", response.data);
        const userProfile = response.data.find(
          (profile) => profile.id === userInfo.id
        );
        if (!userProfile) {
          console.error("No matching user profile found.");
          return;
        }
        if (userProfile && userProfile.profile_img) {
          setProfileImg(userProfile.profile_img);
        } else {
          console.warn("User profile found but no profile image set.");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImg();
  }, [userInfo?.id, accessToken]);
  return (
    <>
    {user ?
      <div>
        {profileImg ?
          (
            <img style={{width:'50px', height:'50px',borderRadius:'40px' }} 
            src={profileImg} 
            alt="User Profile" />
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
