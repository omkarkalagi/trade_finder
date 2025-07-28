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

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState({ isAuthenticated: true }); // Always authenticated

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
