import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Ensure this is imported
import { fetchUserProfile } from './FetchUserProfile';

const UserProfile = () => {
  const { lookupField, lookupValue } = useParams(); // Extract parameters from the route
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (lookupField && lookupValue) {
          const data = await fetchUserProfile(lookupField, lookupValue);
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [lookupField, lookupValue]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found.</div>;

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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className="page-container">
      <div className='main-container'>
        <h1>{renderProfileImage(profile.profile_img)} {profile.full_name}</h1>
        <p>Email: {profile.email}</p>
        <p>Phone number: {profile.phoneNumber}</p>
        <p>Birth Day: {formatDate(profile.birth_date)}</p>
        <p>About me: {profile.aboutMe}</p>
        <p>Member Since: {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserProfile;
