// import { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { AuthContext } from './AuthContext';

// const ProtectedRoute = ({ children }) => {
//     const { auth } = useContext(AuthContext);

//     if (!auth) {
//         // Redirect to 404 if user is not authenticated
//         return <Navigate to="*" />;
//     }

//     return children;
// };

// ProtectedRoute.propTypes = {
//     children: PropTypes.node.isRequired,
// };

// export default ProtectedRoute;
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';


const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // Otherwise, allow access to the route
  return element;
};
PrivateRoute.propTypes = {
    element: PropTypes.node.isRequired, // Expect a valid React element
  };
export default PrivateRoute;
