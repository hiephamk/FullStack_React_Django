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

  return (
    <div className="page-container">
      <div className='main-container'>
        <h1>{profile.full_name}</h1>
        <p>Email: {profile.email}</p>
        <p>About me: {profile.aboutMe}</p>
        <p>Member Since: {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserProfile;
