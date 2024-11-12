import { useEffect, useState } from "react";
import axios from 'axios';
import { ImProfile } from "react-icons/im";
import { useSelector } from 'react-redux';

const Profile = () => {
  const [profileImg, setProfileImg] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfileImg = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        if (!token) {
          console.error("Token not found in local storage");
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/account/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' if Django uses Token Auth; 'Bearer' for JWT Auth
          },
        });

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

    if (userInfo) { // Ensure userInfo is defined before fetching
      fetchProfileImg();
    }
  }, [userInfo]);

  return (
    <div>
      <div>
        {profileImg ? (
          <img className="profile-img" src={profileImg} alt="User Profile" />
        ) : (
          <ImProfile />
        )}
      </div>
    </div>
  );
};

export default Profile;
