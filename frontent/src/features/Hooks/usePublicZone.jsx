import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const usePublicZone = () => {
  const { user, userInfo } = useSelector(state => state.auth); // Still use `user` info if needed
  const [contents, setContent] = useState([]); // Define contents state inside the hook
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const url = `http://127.0.0.1:8000/api/publiczone/`;
      const response = await axios.get(url); // No need for access token
      const sortedPost = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setContent(sortedPost);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when component is mounted (or when the `userInfo` changes, if required)
  useEffect(() => {
    fetchContent();
  }, []); // Empty array makes it run only once when the component is mounted

  // if (loading) return <div>Loading...</div>; // Handle loading state

  return contents;
};

export default usePublicZone;
