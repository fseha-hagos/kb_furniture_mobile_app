import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import NetworkError from './components/NetworkError';
import { AuthProvider } from './context/cartContext';
import { NetworkProvider, useNetwork } from './context/networkContext';
import { ProductProvider } from './context/productContext';
import { ThemeProvider } from './context/themeContext';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
// const Tab = createBottomTabNavigator();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15, borderRadius: 10 }}
      text1Style={{
        fontSize: 17,
        fontFamily: "mon-sb",
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: "mon",
        fontWeight: "500",
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4287f5", borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15, borderRadius: 10 }}
      text1Style={{
        fontSize: 17,
        fontFamily: "mon-sb",
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: "mon",
        fontWeight: "500",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15, borderRadius: 10 }}
      text1Style={{
        fontSize: 17,
        fontFamily: "Jakarta-Bold",
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: "Jakarta-Bold",
        fontWeight: "500",
      }}
    />
  ),
};

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

// Network-aware wrapper for the app
const NetworkAwareApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected } = useNetwork();
  const [hasEverConnected, setHasEverConnected] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    if (isConnected) {
      setHasEverConnected(true);
      setShowToast(false);
      Toast.hide();
    } else if (isConnected === false) {
      if (hasEverConnected) {
        setShowToast(true);
        Toast.show({
          type: 'error',
          text1: 'Network Unavailable',
          text2: 'You are offline. Some features may not work.',
          position: 'top',
          autoHide: false,
        });
      }
    }
  }, [isConnected]);

  // Only show full screen error if the app has never been online
  if (isConnected === false && !hasEverConnected) {
    return (
      <View style={{ flex: 1 }}>
        <NetworkError onRetry={() => {}} message="No internet connection. Please check your network." />
      </View>
    );
  }
  return <>{children}</>;
};

const RootLayout = () => {
  const router = useRouter();
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <SafeAreaProvider>
          <NetworkProvider>
            <AuthProvider>
              <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>  
                <ProductProvider>
                  <NetworkAwareApp>
                    <InitialLayout />
                    <Toast config={toastConfig} />
                  </NetworkAwareApp>
                </ProductProvider>
              </ClerkProvider>
            </AuthProvider>
          </NetworkProvider>
        </SafeAreaProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
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
