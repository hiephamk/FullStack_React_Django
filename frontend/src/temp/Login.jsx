import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link} from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { setAuth, setEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post('/api/v1/auth/jwt/create/', credentials);
      const { token, email } = response.data;

      // Store token and username in both context and storage
      localStorage.setItem('token', token);
      localStorage.setItem('username', email);
      setAuth(token);
      setEmail(email);

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
    <div className='container auth__container'>
      <form onSubmit={handleSubmit} className='auth__form'>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
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
        <Link to="/reset-password">Forget Password ?</Link>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
