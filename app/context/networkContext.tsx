// Provides network connectivity status to the app using @react-native-community/netinfo.
// Use useNetwork() to access { isConnected } anywhere in the app.
// Shows full-screen error or toast based on connectivity.
import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface NetworkContextType {
  isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: null });

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Set initial state to true to avoid showing error screen on app start
    setIsConnected(true);
    
    const unsubscribe = NetInfo.addEventListener(state => {
      // Only update if we have a definitive connection state
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    
    // Fetch current state after a longer delay to allow proper initialization
    const fetchState = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected);
      } catch (error) {
        console.log('Error fetching network state:', error);
        // Default to connected if we can't determine state
        setIsConnected(true);
      }
    };
    
    // Delay the initial fetch to avoid race conditions during app startup
    const timer = setTimeout(fetchState, 3000);
    
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider; 