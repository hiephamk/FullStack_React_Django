
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './api';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth, setUsername: setAuthUsername} = useContext(AuthContext);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await loginUser({ username, password });
            const token = response.data.auth_token;
            localStorage.setItem('token', token);
            setAuth(response.data.auth_token);
            setAuthUsername(username);
            navigate('/home')
            setAuth(token); // Update auth context
        } catch (error) {
            console.error('Login failed:', error.response?.Users || error.message);
        }
    };

    const handleCheckboxChange = (e) => {
        setRememberMe(e.target.checked);
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h1>Sign in</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={handleCheckboxChange}
                        />
                        Remember Me
                    </label>
                </div>
                <button onClick={handleLogin}>Sign in</button>
                <p>Don&apos;t have an account? <Link to="/register">Sign up</Link></p>
            </div>
        </div>
    );
}

export default Login;
