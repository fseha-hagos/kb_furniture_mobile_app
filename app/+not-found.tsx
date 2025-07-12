import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Connection Error',
        headerShown: false 
      }} />
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef', '#dee2e6']}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.iconGradient}
            >
              <Ionicons name="cloud-offline" size={60} color="white" />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Connection Error</Text>
          <Text style={styles.subtitle}>
            We're having trouble connecting to our servers. This might be due to:
          </Text>
          
          <View style={styles.reasonsContainer}>
            <View style={styles.reasonItem}>
              <Ionicons name="wifi-outline" size={20} color="#6B7280" />
              <Text style={styles.reasonText}>Poor internet connection</Text>
            </View>
            
            <View style={styles.reasonItem}>
              <Ionicons name="server-outline" size={20} color="#6B7280" />
              <Text style={styles.reasonText}>Server maintenance</Text>
            </View>
            
            <View style={styles.reasonItem}>
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.reasonText}>Request timeout</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                // Reload the app or go back to home
                window.location.reload();
              }}
            >
              <LinearGradient
                colors={['#00685C', '#00897B']}
                style={styles.retryButtonGradient}
              >
                <Ionicons name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Link href="/(auth)/(tabs)/home" style={styles.homeLink}>
              <Text style={styles.homeLinkText}>Go to Home</Text>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  reasonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reasonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  retryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00685C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  homeLink: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  homeLinkText: {
    fontSize: 16,
    color: '#00685C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
