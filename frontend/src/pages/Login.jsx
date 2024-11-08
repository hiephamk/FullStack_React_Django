import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Send a POST request to the Djoser token login endpoint
            const response = await axios.post(
                'http://localhost:8000/auth/login/', 
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            // Check if the response contains the token
            if (response.status === 200) {
                const { auth_token } = response.data;

                // Store the token in localStorage (you can use sessionStorage if preferred)
                localStorage.setItem('token', auth_token);

                // Set the token for future requests (optional)
                axios.defaults.headers['Authorization'] = `Token ${auth_token}`;

                // Call the onLogin callback and navigate to the layout page
                onLogin();
                navigate('/layout');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('An error occurred. Please try again.');
        }
    };
    
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired, // Expect onLogin to be a required function
};

export default Login;
