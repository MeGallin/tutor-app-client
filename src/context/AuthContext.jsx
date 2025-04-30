import { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

/**
 * AuthProvider component that wraps the application and provides authentication state
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for saved auth token on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const userData = localStorage.getItem('user');
        
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Login function to set user data and token
  const login = (userData, token) => {
    const user = {
      ...userData,
      token
    };
    
    // Save to local storage
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for accessing auth context from components
 */
export function useAuth() {
  return useContext(AuthContext);
}