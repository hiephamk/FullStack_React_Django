import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
const API = axios.create({ baseURL: 'http://127.0.0.1:8000/auth/' });

export const registerUser = (data) => API.post('users/', data);
export const loginUser = (data) => API.post('token/login/', data);
export const logoutUser = () => API.post('token/logout/');

