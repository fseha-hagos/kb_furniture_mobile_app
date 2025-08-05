import * as ScreenCapture from 'expo-screen-capture';

export class ScreenshotPreventionManager {
  private static isEnabled = false;

  static async enablePrevention(): Promise<void> {
    try {
      await ScreenCapture.preventScreenCaptureAsync();
      this.isEnabled = true;
      console.log('Screenshot prevention enabled');
    } catch (error) {
      console.log('Screenshot prevention not supported on this platform:', error);
    }
  }

  static async disablePrevention(): Promise<void> {
    try {
      await ScreenCapture.allowScreenCaptureAsync();
      this.isEnabled = false;
      console.log('Screenshot prevention disabled');
    } catch (error) {
      console.log('Screenshot allowance not supported on this platform:', error);
    }
  }

  static isPreventionEnabled(): boolean {
    return this.isEnabled;
  }

  static async togglePrevention(): Promise<void> {
    if (this.isEnabled) {
      await this.disablePrevention();
    } else {
      await this.enablePrevention();
    }
  }
}

// Convenience functions
export const enableScreenshotPrevention = () => ScreenshotPreventionManager.enablePrevention();
export const disableScreenshotPrevention = () => ScreenshotPreventionManager.disablePrevention();
export const isScreenshotPreventionEnabled = () => ScreenshotPreventionManager.isPreventionEnabled();
export const toggleScreenshotPrevention = () => ScreenshotPreventionManager.togglePrevention(); 