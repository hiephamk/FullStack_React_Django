import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../auth/authSlice";
import Spinner from "../components/Spinner";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo, isLoading, isError, message } = useSelector((state) => state.auth);
  
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");  // Redirect to login if the user is not logged in
    } else {
      dispatch(getUserInfo());  // Fetch user info if the user is logged in
    }

    if (isError) {
      console.error(message);
    }
  }, [userInfo, isError, message, dispatch, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!userInfo) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!image) {
      alert("Please select an image to upload");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];

      const response = await fetch("http://127.0.0.1:8000/api/upload-profile-image/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blob: base64Image }),
      });

      const data = await response.json();
      if (data.error === 0) {
        alert("Profile image uploaded successfully!");
        // Optionally, you can fetch the updated user info here.
      } else {
        alert("Error uploading image");
      }
    };
  };

  return (
    <div className="container profile__container">
      <h1 className="main__title">User Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>

        {/* Show the user profile image */}
        {userInfo.image ? (
          <img 
            src={`http://127.0.0.1:8000/media/${userInfo.image}`} 
            alt="Profile" 
            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }} 
          />
        ) : (
          <p>No profile image available</p>
        )}

        {/* Image upload form */}
        <div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          <button onClick={handleImageUpload}>Upload Image</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
