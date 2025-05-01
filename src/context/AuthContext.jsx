import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import * as authService from '../services/authService';
import { log } from '../utils/config';
import { handleApiError } from '../utils/errorHandling';
import {
  getStoredUser,
  storeUserData,
  clearUserData,
  isTokenExpired,
  TOKEN_REFRESH_INTERVAL,
} from '../utils/tokenStorage';

// Create the authentication context
const AuthContext = createContext();

/**
 * AuthProvider component that wraps the application and provides authentication state
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved authentication data on component mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = getStoredUser();

        if (storedUser) {
          // If token is expired or about to expire, try to refresh it
          if (isTokenExpired()) {
            refreshToken(storedUser.token);
          } else {
            // Token is still valid, set the current user
            setCurrentUser(storedUser);
          }
        }
      } catch (error) {
        log('Error loading auth state:', error);
        clearUserData();
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!currentUser?.token) return;

    // Set up token refresh timer
    const refreshInterval = setInterval(() => {
      refreshToken(currentUser.token);
    }, TOKEN_REFRESH_INTERVAL);

    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, [currentUser?.token]);

  // Token refresh function
  const refreshToken = useCallback(
    async (token) => {
      if (!token) return;

      try {
        const refreshedData = await authService.refreshToken(token);

        if (refreshedData?.token) {
          // Update user data with new token
          const updatedUser = {
            ...currentUser,
            ...refreshedData,
            token: refreshedData.token,
          };

          // Store updated user data
          storeUserData(updatedUser);

          // Update current user state
          setCurrentUser(updatedUser);
          log('Token refreshed successfully');
        }
      } catch (err) {
        log('Token refresh failed:', err);
        // If refresh fails, we don't immediately log the user out
        // A later API call might trigger the actual logout if needed
      }
    },
    [currentUser],
  );

  // Login using the auth service
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await authService.login({ email, password });

      // Store user data with token information
      storeUserData(userData);

      // Update state
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(handleApiError(err, 'Login'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register using the auth service
  const register = async ({ name, email, password }) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await authService.register({ name, email, password });

      // Store user data with token information
      storeUserData(userData);

      // Update state
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(handleApiError(err, 'Registration'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend logout if user is logged in
      if (currentUser?.token) {
        await authService.logout();
      }
    } catch (err) {
      // Ignore errors on logout
      log('Logout error:', err);
    } finally {
      // Always clear user data and state
      clearUserData();
      setCurrentUser(null);
      setError(null);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register,
    refreshToken,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook for accessing auth context from components
 */
export function useAuth() {
  return useContext(AuthContext);
}
