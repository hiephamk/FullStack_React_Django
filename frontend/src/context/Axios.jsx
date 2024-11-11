import axios from 'axios'

const AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Your API URL
  });
  
  // Add request interceptor to add Authorization token
  AxiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default AxiosInstance