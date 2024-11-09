import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { setAuth, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post('/api/login/', credentials);
      const { token, username } = response.data;

      // Store token and username in both context and storage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setAuth(token);
      setUsername(username);

      navigate('/home'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Login error', error);
      alert('Login failed, please check your credentials.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(credentials);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={credentials.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
