import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Wraps any page that requires authentication.
 * If no JWT token is found in localStorage, redirects to /login.
 * Optionally restricts by role: allowedRoles={['Administrator']}
 */
export default function ProtectedRoute({ children, allowedRoles }) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        if (!token || !user) {
            navigate('/login', { replace: true });
            return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect to their correct dashboard
            if (user.role === 'Driver') navigate('/driver-dashboard', { replace: true });
            else if (user.role === 'Dispatcher') navigate('/dispatcher-dashboard', { replace: true });
            else navigate('/dashboard', { replace: true });
        }
    }, []);

    const token = localStorage.getItem('token');
    if (!token) return null; // prevent flash before redirect

    return children;
}
