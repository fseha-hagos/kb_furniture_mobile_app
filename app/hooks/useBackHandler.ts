import { useEffect } from 'react';
import { BackHandler } from 'react-native';

interface UseBackHandlerOptions {
  onBackPress?: () => boolean;
  enabled?: boolean;
}

export const useBackHandler = ({ onBackPress, enabled = true }: UseBackHandlerOptions = {}) => {
  useEffect(() => {
    if (!enabled) return;

    const backAction = () => {
      if (onBackPress) {
        return onBackPress();
      }
      return false; // Let the default back action happen
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      try {
        if (backHandler && typeof backHandler.remove === 'function') {
          backHandler.remove();
        }
      } catch (error) {
        console.log('BackHandler cleanup error:', error);
      }
    };
  }, [onBackPress, enabled]);
}; 