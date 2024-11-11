
import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email') || sessionStorage.getItem('email'));


  useEffect(() => {
    // Store auth and username in localStorage/sessionStorage when they change
    if (auth) {
      localStorage.setItem('token', auth);
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    }
  }, [auth, email]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    setAuth(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, email, setEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};