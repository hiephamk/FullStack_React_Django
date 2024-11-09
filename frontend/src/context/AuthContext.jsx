
import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || sessionStorage.getItem('username'));
  const [user_id, setUserId] = useState(localStorage.getItem('user_id') || sessionStorage.getItem('user_id'));

  useEffect(() => {
    // Store auth and username in localStorage/sessionStorage when they change
    if (auth) {
      localStorage.setItem('token', auth);
      localStorage.setItem('username', username);
      localStorage.setItem('user_id', user_id);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user_id');
    }
  }, [auth, username, user_id]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('user_id');
    setAuth(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, username, setUsername, user_id, setUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};