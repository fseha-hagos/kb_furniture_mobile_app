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
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    NetInfo.fetch().then(state => setIsConnected(state.isConnected));
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider; 