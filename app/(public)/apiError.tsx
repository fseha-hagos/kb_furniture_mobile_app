import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ApiError = () => {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Simulate retry delay
    setTimeout(() => {
      setIsRetrying(false);
      router.push('/(auth)/(tabs)/home');
    }, 2000);
  };

  const handleGoHome = () => {
    router.push('/(auth)/(tabs)/home');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline-outline" size={80} color="#FF6B6B" />
        </View>

        {/* Error Title */}
        <Text style={styles.title}>Connection Error</Text>
        
        {/* Error Description */}
        <Text style={styles.description}>
          We're having trouble connecting to our servers. This might be due to:
        </Text>

        {/* Error Reasons */}
        <View style={styles.reasonsContainer}>
          <View style={styles.reasonItem}>
            <Ionicons name="wifi-outline" size={20} color="#666" />
            <Text style={styles.reasonText}>Poor internet connection</Text>
          </View>
          
          <View style={styles.reasonItem}>
            <Ionicons name="server-outline" size={20} color="#666" />
            <Text style={styles.reasonText}>Server maintenance</Text>
          </View>
          
          <View style={styles.reasonItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.reasonText}>Temporary service outage</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.retryButton]} 
            onPress={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="refresh-outline" size={20} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleGoHome}
          >
            <Ionicons name="home-outline" size={20} color="#00685C" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Go to Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#00685C" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>

        {/* Additional Help */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Still having issues?</Text>
          <Text style={styles.helpText}>
            Contact our support team at support@kbfurniture.com or call us at +1-555-0123
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  reasonsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  retryButton: {
    backgroundColor: '#00685C',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00685C',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#00685C',
  },
  helpContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ApiError;
