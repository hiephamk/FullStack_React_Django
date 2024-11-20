
import PropTypes from 'prop-types'; // Import PropTypes
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
};

// Add prop types for validation
PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired, // Expect children to be a node (React element)
    isAuthenticated: PropTypes.bool.isRequired // Expect isAuthenticated to be a boolean
};

export default PrivateRoute;
