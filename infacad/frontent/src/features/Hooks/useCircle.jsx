import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

// eslint-disable-next-line react/prop-types
const useCircle = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

   const [Circle, setCircle] = useState([]);

  const fetchCircles = async () => {
    const url = `http://127.0.0.1:8000/api/circles/`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(url, config);
      const filteMember = response.data.filter(member => member.owner === userInfo.id)
      setCircle(filteMember);
    } catch (error) {
      console.error("Error fetching circles:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCircles();
    }
  }, [accessToken, setCircle]);

  return {Circle,
    fetchCircles,}
};

export default useCircle;

