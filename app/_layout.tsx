import { useColorScheme } from '@/hooks/useColorScheme';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetworkError from './components/NetworkError';
import { AuthProvider } from './context/cartContext';
import { ProductProvider } from './context/productContext';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
// const Tab = createBottomTabNavigator();

const InitialLayout = () => {
 const { isLoaded, isSignedIn } = useAuth();
 
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(auth)';

    console.log('User changed: ', isSignedIn);

    if (isSignedIn && !inTabsGroup) {
      router.replace('/home');
    } else if (!isSignedIn) {
      router.replace('/home');
      // router.replace('/login');
    }
  }, [isSignedIn]);

  return (
    <Stack>
      <Stack.Screen
        name="apiError"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};


const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

    /*
     <ImageBackground style={styles.background} source={require("./src/assets/coffee_assets/americano/portrait/americano_pic_1_portrait.png")}>
     
       <View style={styles.loginBtn}><Text style={styles.loginTxt}>Login</Text></View>
       <View style={styles.loginBtn}><Text style={styles.loginTxt}>Sign In</Text></View>
     
   </ImageBackground>
   
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
    <InitialLayout />
  </ClerkProvider>

    */

// Global Error Boundary Component
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <NetworkError
            onRetry={this.handleRetry}
            message="Something unexpected happened. Please try again."
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
   
//     <ImageBackground style={styles.background} source={require("./src/assets/coffee_assets/americano/portrait/americano_pic_1_portrait.png")}>
     
//     <View style={styles.loginBtn}><Text style={styles.loginTxt}>Login</Text></View>
//     <View style={styles.loginBtn}><Text style={styles.loginTxt}>Sign In</Text></View>
  
// </ImageBackground>
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>  
            <ProductProvider>
              <InitialLayout />
            </ProductProvider>
          </ClerkProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
};

const styles = StyleSheet.create({
  background : {
    flex: 1,
    justifyContent: "center",
  },

  loginBtn: {
    width: "100%",
    height: 70,
   
    justifyContent: "center",
    alignItems: "center",
   
    backgroundColor: "red",
    marginTop: 15,
    marginRight: 20,
    marginLeft: 20,
    borderLeftColor: "#000",
    borderRadius: 10,
  },
  loginTxt: {
   fontSize: 22,
   color: "#fff",
   fontWeight: 'bold'
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default RootLayout;
