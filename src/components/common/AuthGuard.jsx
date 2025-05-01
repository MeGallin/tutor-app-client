import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AuthGuard component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required (can be inverted to create a "guest only" guard)
 * @returns {React.ReactElement} The protected route or a redirect
 */
const AuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '200px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Checking authentication...</span>
      </div>
    );
  }

  // If requireAuth is true, redirect to login when not authenticated
  // If requireAuth is false, redirect to dashboard when authenticated (for login/register pages)
  if (requireAuth ? !isAuthenticated : isAuthenticated) {
    return (
      <Navigate
        to={requireAuth ? '/login' : '/dashboard'}
        state={{ from: location }}
        replace
      />
    );
  }

  // If authentication state matches requirement, render children
  return children;
};

export default AuthGuard;
