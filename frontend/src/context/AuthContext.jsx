
import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
  const [username, setUsername] = useState(null);
  
  const logout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, username, setUsername, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // children can be any valid React node
};