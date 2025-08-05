import { disableScreenshotPrevention, enableScreenshotPrevention } from '@/utils/screenshotPrevention';
import { useEffect } from 'react';

export const useGlobalScreenshotPrevention = () => {
  useEffect(() => {
    // Enable screenshot prevention when component mounts
    enableScreenshotPrevention();

    // Disable screenshot prevention when component unmounts
    return () => {
      disableScreenshotPrevention();
    };
  }, []);
}; 