import React, { createContext, useContext } from 'react';
import useAlpaca from '../hooks/useAlpaca';

// Create the context
const AlpacaContext = createContext(null);

// Create a provider component
export const AlpacaProvider = ({ children }) => {
  const alpacaData = useAlpaca();

  return (
    <AlpacaContext.Provider value={alpacaData}>
      {children}
    </AlpacaContext.Provider>
  );
};

// Custom hook to use the Alpaca context
export const useAlpacaContext = () => {
  const context = useContext(AlpacaContext);
  if (context === null) {
    throw new Error('useAlpacaContext must be used within an AlpacaProvider');
  }
  return context;
};

export default AlpacaContext;
