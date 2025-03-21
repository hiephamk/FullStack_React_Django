import axios from "axios";



export const fetchUserProfile = async (lookupField, lookupValue) => {

  const response = await axios.get(`http://127.0.0.1:8000/api/profile/${lookupField}/${lookupValue}/`);
  return response.data;
};