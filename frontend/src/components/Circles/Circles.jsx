import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

// eslint-disable-next-line react/prop-types
const Circles = ({circles, setCircles}) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

const fetchCircles = async () => {
  if (!accessToken) return;

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/circles/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userCircles = response.data.filter(
      (circle) => circle.owner === userInfo.id
    );

    setCircles(userCircles);
  } catch (error) {
    console.error('Error fetching circles:', error);
  }
};
useEffect(()=>{
  if(accessToken){
    fetchCircles()
  }
},[accessToken, setCircles, circles])

  return (
    <div>
         {circles.length > 0 ? (
          circles.map((member) => (
            <div key={member.id}>
              <p>{member.member_name}</p>
            </div>
          ))
        ): (null)}
      </div>
  );
};

export default Circles;

