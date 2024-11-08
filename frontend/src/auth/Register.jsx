
import { useState } from 'react';
import { registerUser } from './api';
import { useNavigate, Link } from 'react-router-dom';


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            registerUser({ username, password, email, first_name, last_name });
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-content'>
                <h2>Register</h2>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" placeholder="Frist Name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleRegister}>Register</button>
                <p>Do you have an account? <Link to="/">Sign in</Link></p>
            </div>
        </div>
    );
}

export default Register;
