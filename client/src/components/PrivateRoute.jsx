import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, roles }) {
    const { user, token } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (roles && user && !roles.includes(user.role)) {
        return <div className="error-message">Access Denied: You do not have permission to view this page.</div>;
    }

    return children;
}
