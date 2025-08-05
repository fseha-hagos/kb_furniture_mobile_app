import { disableScreenshotPrevention, enableScreenshotPrevention } from '@/utils/screenshotPrevention';
import { useEffect } from 'react';

export const useScreenshotPrevention = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    // Enable screenshot prevention when component mounts
    enableScreenshotPrevention();

    // Disable screenshot prevention when component unmounts
    return () => {
      disableScreenshotPrevention();
    };
  }, [enabled]);

  const preventScreenshot = async () => {
    await enableScreenshotPrevention();
  };

  const allowScreenshot = async () => {
    await disableScreenshotPrevention();
  };

  return {
    preventScreenshot,
    allowScreenshot,
  };
}; 