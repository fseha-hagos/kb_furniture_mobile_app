import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface NetworkErrorProps {
  onRetry: () => void;
  message?: string;
}

const NetworkError: React.FC<NetworkErrorProps> = ({ 
  onRetry, 
  message = "No internet connection. Please check your network and try again." 
}) => {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons name="cloud-offline-outline" size={64} color={primaryColor} />
      <Text style={[styles.title, { color: textColor }]}>Connection Error</Text>
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      
      <TouchableOpacity 
        style={[styles.retryButton, { backgroundColor: primaryColor }]} 
        onPress={onRetry}
      >
        <Ionicons name="reload" size={20} color="#fff" />
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
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