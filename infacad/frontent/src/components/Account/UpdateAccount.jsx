import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAccessToken from '../../features/auth/token';

const CreateOrUpdateAccount = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate()
  const [profileImg, setProfileImg] = useState(null);
  const [birth_date, setBirth_date] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountId, setAccountId] = useState(null); // To store the account ID if exists

  useEffect(() => {
    if (user && accessToken && userInfo?.id) {
      const fetchAccountData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/account/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userAccount = response.data.find(account => account.user === userInfo.id);
          if (userAccount) {
            console.log("userAccount:", userAccount);
            setAccountId(userAccount.id);
            setPhoneNumber(userAccount.phoneNumber || "");
            setBirth_date(userAccount.birth_date ? new Date(userAccount.birth_date).toISOString().split('T')[0] : '');
            setAboutMe(userAccount.aboutMe || '');
            setProfileImg(userAccount.profile_img || null);
          }
        } catch (error) {
          console.error('Error fetching account details:', error);
        }
      };
      fetchAccountData();
    }
  }, [user, accessToken, userInfo?.id]);
  

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
      alert('Account created or updated successfully!');
      navigate('/home')
    } catch (error) {
      console.error('Error creating/updating account:', error.response || error.message);
      toast.error('Failed to create or update account.');
    }
  };

  return (
    <div  >
      {
        accountId?
        (<form onSubmit={handleFormSubmit} className='form-container'>
          <h4>Update Your Profile</h4>
        <div className="form-group d-flex flex-column align-items-md-center">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="phone number"
            style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
          />
          <input
            type="date"
            value={birth_date}
            onChange={(e) => setBirth_date(e.target.value)}
            placeholder="Birthdate"
            style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
          />
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Tell us about yourself"
            rows="4"
            style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImg(e.target.files[0])}
            style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
          />
          <button type="submit" className="btn btn-primary text-center" style={{border:'1px solid #111', width:'auto', borderRadius:'5px', padding:'10px', margin:'10px'}}>
            {accountId ? 'Update Account' : 'Create Account'}
          </button>
        </div>
        </form>)
        :
        <form onSubmit={handleFormSubmit} className='form-container' style={{ display: 'flex', flexDirection: 'column' }}>
          <h4>Create your Profile</h4>
          <div className='form-group d-flex flex-column align-items-md-center'>
            <input
              type="text"
              value={phoneNumber || ""}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="phone number"
              style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
            />
            <input
              type="date"
              value={birth_date || ""}
              onChange={(e) => setBirth_date(e.target.value)}
              placeholder="Birthdate"
              style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
            />
            <textarea
              value={aboutMe || ""}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Tell us about yourself"
              rows="4"
              style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImg(e.target.files[0])}
              style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px', margin:'10px'}}
            />
            <button type="submit" className="btn btn-primary text-center" style={{border:'1px solid #111', width:'auto', borderRadius:'5px', padding:'10px', margin:'10px'}}>
              {accountId ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      }
    </div>
  );
};

export default CreateOrUpdateAccount;
