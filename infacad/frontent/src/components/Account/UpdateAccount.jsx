import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAccessToken from '../../features/auth/token';

const CreateOrUpdateAccount = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [profileImg, setProfileImg] = useState(null);
  const [birth_date, setBirth_date] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountId, setAccountId] = useState(null); // To store the account ID if exists

  useEffect(() => {
    if (user) {
      const url = `http://127.0.0.1:8000/api/account/`;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      
      axios.get(url, config)
        .then((response) => {
          console.log('Account response:', response.data);
          const account = response.data;
          const userAccount = account.find(account => account.user === userInfo.id);
          if (userAccount) {
            console.log("useraccount: ", userAccount);
            // If account exists, set the account data to pre-fill the form
            setAccountId(userAccount.id);
            setPhoneNumber(userAccount.phoneNumber || "");
            setBirth_date(userAccount.birth_date || '');
            setAboutMe(userAccount.aboutMe || '');
            setProfileImg(userAccount.profile_img || null);
          }
        })
        .catch((error) => {
          console.error('Error fetching account details:', error);
        });
    }
  }, [user, accessToken, userInfo.id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create or update your account.');
      return;
    }

    const url = accountId ? `http://127.0.0.1:8000/api/account/${accountId}/` : 'http://127.0.0.1:8000/api/account/';
    const method = accountId ? 'PUT' : 'POST'; // Use PUT for updating, POST for creating
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const formData = new FormData();
    formData.append('user', userInfo.id);  // Check if this matches your backend model
    formData.append('phoneNumber', phoneNumber);  // Check if this matches your backend model
    formData.append('birth_date', birth_date);
    formData.append('aboutMe', aboutMe);

    if (profileImg) {
      formData.append('profile_img', profileImg);
    }

    // Debug: Log the form data to make sure it's correct
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      await axios({
        method,
        url,
        data: formData,
        headers: config.headers, // Axios will handle the multipart boundary
      });
      setPhoneNumber("");
      setProfileImg("");
      setAboutMe("");
      setBirth_date("")
      toast.success('Account created or updated successfully!');
    } catch (error) {
      console.error('Error creating/updating account:', error.response || error.message);
      toast.error('Failed to create or update account.');
    }
  };

  return (
    <div>
      <h2>{accountId ? 'Update Your Account' : 'Create a New Account'}</h2>
      <form onSubmit={handleFormSubmit} className='auth__form' style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          value={phoneNumber || ""}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="phone number"
        />
        <input
          type="date"
          value={birth_date || ""}
          onChange={(e) => setBirth_date(e.target.value)}
          placeholder="Birthdate"
        />
        <textarea
          value={aboutMe || ""}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Tell us about yourself"
          rows="4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImg(e.target.files[0])}
        />
        <button type="submit" className="btn btn-primary">
          {accountId ? 'Update Account' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrUpdateAccount;
