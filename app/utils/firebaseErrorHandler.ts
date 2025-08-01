import { db } from '@/firebaseConfig';
import * as Updates from 'expo-updates';
import { disableNetwork, enableNetwork } from 'firebase/firestore';
import { Alert } from 'react-native';

export interface FirebaseErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableAppReload?: boolean;
  showAlert?: boolean;
}

export interface FirebaseErrorResult {
  success: boolean;
  error?: any;
  shouldReload?: boolean;
  retryCount?: number;
}

export class FirebaseErrorHandler {
  private static instance: FirebaseErrorHandler;
  private retryCount: number = 0;
  private isReloading: boolean = false;

  private constructor() {}

  static getInstance(): FirebaseErrorHandler {
    if (!FirebaseErrorHandler.instance) {
      FirebaseErrorHandler.instance = new FirebaseErrorHandler();
    }
    return FirebaseErrorHandler.instance;
  }

  /**
   * Check if the error indicates a Firebase connection issue
   */
  private isConnectionError(error: any): boolean {
    const connectionErrorCodes = [
      'failed-precondition',
      'unavailable',
      'deadline-exceeded',
      'resource-exhausted'
    ];

    const connectionErrorMessages = [
      "Backend didn't respond within 10 seconds",
      "Could not reach Cloud Firestore backend",
      "Network request failed",
      "Connection timeout",
      "No internet connection"
    ];

    return (
      connectionErrorCodes.includes(error.code) ||
      connectionErrorMessages.some(msg => 
        error.message?.toLowerCase().includes(msg.toLowerCase())
      )
    );
  }

  /**
   * Check if the error indicates empty data response
   */
  private isEmptyDataError(error: any): boolean {
    return (
      error.code === 'not-found' ||
      error.message?.includes('No documents') ||
      error.message?.includes('empty')
    );
  }

  /**
   * Attempt to reconnect to Firebase
   */
  private async attemptReconnection(): Promise<boolean> {
    try {
      console.log('Attempting to reconnect to Firebase...');
      await disableNetwork(db);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await enableNetwork(db);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Firebase reconnection successful');
      return true;
    } catch (error) {
      console.error('Firebase reconnection failed:', error);
      return false;
    }
  }

  /**
   * Reload the app using expo-updates
   */
  private async reloadApp(): Promise<void> {
    if (this.isReloading) return;
    
    this.isReloading = true;
    console.log('Reloading app...');
    
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error reloading app:', error);
      Alert.alert(
        'Reload Failed',
        'Please manually restart the app.',
        [{ text: 'OK' }]
      );
    } finally {
      this.isReloading = false;
    }
  }

  /**
   * Handle Firebase errors with retry logic and app reload
   */
  async handleError(
    error: any, 
    options: FirebaseErrorHandlerOptions = {}
  ): Promise<FirebaseErrorResult> {
    const {
      maxRetries = 3,
      retryDelay = 2000,
      enableAppReload = true,
      showAlert = true
    } = options;

    console.error('Firebase error occurred:', error);

    // Check if it's a connection error
    if (this.isConnectionError(error)) {
      this.retryCount++;

      if (this.retryCount <= maxRetries) {
        console.log(`Connection error, retry ${this.retryCount}/${maxRetries}`);
        
        // Try to reconnect
        const reconnected = await this.attemptReconnection();
        
        if (reconnected) {
          this.retryCount = 0;
          return { success: true, retryCount: this.retryCount };
        }

        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return { success: false, error, retryCount: this.retryCount };
      } else {
        // Max retries reached, consider app reload
        if (enableAppReload && !this.isReloading) {
          if (showAlert) {
            Alert.alert(
              'Connection Issue',
              'Unable to connect to the server. The app will reload to refresh the connection.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    this.retryCount = 0;
                  }
                },
                {
                  text: 'Reload',
                  onPress: () => this.reloadApp()
                }
              ]
            );
          } else {
            await this.reloadApp();
          }
        }

        this.retryCount = 0;
        return { 
          success: false, 
          error, 
          shouldReload: true,
          retryCount: this.retryCount 
        };
      }
    }

    // Check if it's an empty data error
    if (this.isEmptyDataError(error)) {
      console.log('Empty data response from Firebase');
      return { success: false, error, retryCount: this.retryCount };
    }

    // For other errors, reset retry count and return error
    this.retryCount = 0;
    return { success: false, error, retryCount: this.retryCount };
  }

  /**
   * Reset the retry counter
   */
  resetRetryCount(): void {
    this.retryCount = 0;
  }

  /**
   * Get current retry count
   */
  getRetryCount(): number {
    return this.retryCount;
  }

  /**
   * Check if app is currently reloading
   */
  isAppReloading(): boolean {
    return this.isReloading;
  }
}

// Export singleton instance
export const firebaseErrorHandler = FirebaseErrorHandler.getInstance();

// Export convenience functions
export const handleFirebaseError = (error: any, options?: FirebaseErrorHandlerOptions) => {
  return firebaseErrorHandler.handleError(error, options);
};

export const resetFirebaseErrorRetryCount = () => {
  firebaseErrorHandler.resetRetryCount();
};

export const getFirebaseErrorRetryCount = () => {
  return firebaseErrorHandler.getRetryCount();
};

// Default export for the main error handler
export default firebaseErrorHandler; 