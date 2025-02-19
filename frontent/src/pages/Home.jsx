import { useEffect } from 'react';
import useProfile from '../features/auth/UseProfile';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { account, loading, error } = useProfile();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (loading) {
        console.log('Loading user data...');
        return;
      }
  
      if (error) {
        console.log('Error:', error);
        return;
      }
  
      if (account.length > 0) {
        navigate('/home/activities');
      } else {
        navigate('/home/create-profile');
      }
    }, [account, loading, error, navigate]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    return (
      <>
      </>
    )
  };
  
  export default Home;
  