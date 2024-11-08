import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        // Redirect to 404 if user is not authenticated
        return <Navigate to="*" />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
