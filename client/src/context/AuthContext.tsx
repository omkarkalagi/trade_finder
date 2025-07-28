import { createContext, useState, useContext } from 'react';

// Create and export the context
export const AuthContext = createContext({
  currentUser: null,
  loading: true,
  login: () => {},
  logout: () => {}
}); // Add default values

interface AuthProviderProps {
  children: React.ReactNode;
}

// Remove the unused AuthProvider export

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
