import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { handleFirebaseError } from '../utils/firebaseErrorHandler';

interface NetworkErrorProps {
  onRetry: () => void;
  message?: string;
  error?: any;
  enableAppReload?: boolean;
  showReloadOption?: boolean;
}

const NetworkError: React.FC<NetworkErrorProps> = ({ 
  onRetry, 
  message = "Could not reach the server. Please check your connection and try again.",
  error,
  enableAppReload = true,
  showReloadOption = true
}) => {
  
  const handleRetry = async () => {
    if (error) {
      const result = await handleFirebaseError(error, {
        enableAppReload,
        showAlert: true
      });
      
      if (result.success) {
        onRetry();
      }
    } else {
      onRetry();
    }
  };

  const handleAppReload = async () => {
    if (error) {
      await handleFirebaseError(error, {
        enableAppReload: true,
        showAlert: false
      });
    } else {
      Alert.alert(
        'Reload App',
        'This will restart the app to refresh the connection. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reload', 
            onPress: () => {
              // This will trigger the reload through the error handler
              handleFirebaseError(new Error('Manual reload requested'), {
                enableAppReload: true,
                showAlert: false
              });
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={64} color="#00685C" />
      <Text style={styles.title}>Connection Error</Text>
      <Text style={styles.message}>{message}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        
        {showReloadOption && (
          <TouchableOpacity style={styles.reloadButton} onPress={handleAppReload}>
            <Ionicons name="reload" size={20} color="#00685C" />
            <Text style={styles.reloadText}>Reload App</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00685C',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 200,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00685C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00685C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  reloadText: {
    color: '#00685C',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NetworkError; 