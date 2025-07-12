import React, { useEffect } from 'react';
// import TabNavigator from '../navigators/TabNavigator';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/cartContext';


// const Stack = createNativeStackNavigator();

const Layout = () => {
  useEffect(() => {
   // SplashScreen.hide();
  }, []);

  
  return (
    <AuthProvider>
      <SafeAreaView style={styles.scrollContainer}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />      
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />      
      </Stack>
      </SafeAreaView>
    </AuthProvider>
    
  );
};

const styles = StyleSheet.create({
scrollContainer : {
  flex: 1,
}
})

export default Layout;
