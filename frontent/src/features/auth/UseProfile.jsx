import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';
import { toast } from 'react-toastify';

const useProfile = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        toast.error('Please log in again!');
        setLoading(false);
        return;
      }

      try {
        const url = `http://127.0.0.1:8000/api/account/`;
        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        const response = await axios.get(url, config);

        if (Array.isArray(response.data)) {
          const userAccount = response.data.filter((acc) => acc.user === userInfo?.id);
          setAccount(userAccount);
        } else {
          setAccount([]); // Handle unexpected response format
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching account information:', error.response || error.message);
        setError('Failed to fetch account information.');
        toast.error('Error fetching account information!');
      } finally {
        setLoading(false); // Stop loading after the fetch is done
      }
    };

    if (userInfo?.id) {
      fetchUserInfo();
    }
  }, [accessToken, userInfo?.id]);

  return { account, loading, error }; // Returning loading and error for more flexibility in the component
};

export default useProfile;
