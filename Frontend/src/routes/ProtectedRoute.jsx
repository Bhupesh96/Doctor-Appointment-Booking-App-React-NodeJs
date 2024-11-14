import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from './../context/AuthContext'; // Adjust path according to your project structure

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useContext(authContext);
    
    console.log('Token:', token); // For debugging purposes
    console.log('Role:', role);   // For debugging purposes
    
    const isAllowed = allowedRoles.includes(role);
    const accessibleRoute = token && isAllowed ? children : <Navigate to="/login" replace={true} />;
    
    return accessibleRoute;
};

export default ProtectedRoute;
