import { useEffect, useState } from "react";
import axios from 'axios';
import { ImProfile } from "react-icons/im";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'


const ProfileImg = () => {
  const [profileImg, setProfileImg] = useState('');
  const { user, userInfo,token } = useSelector((state) => state.auth);

    useEffect(() => {

        const fetchProfileImg = async () => {
          const url = `http://127.0.0.1:8000/api/account/`
          const config = {
            Authorization: `Bearer ${token.access}`,
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
      if (token.access) {
        fetchProfileImg();
      }
    }, [token.access]);
  
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
