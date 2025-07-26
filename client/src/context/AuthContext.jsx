import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create and export the context
export const AuthContext = createContext({
  currentUser: null,
  loading: true,
  login: () => {},
  logout: () => {}
}); // Add default values

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Add explicit return of context value
  const contextValue = {
    currentUser,
    loading,
    login: (user, token) => {
      localStorage.setItem('token', token);
      setCurrentUser(user);
    },
    logout: () => {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 