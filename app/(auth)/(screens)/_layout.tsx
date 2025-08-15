import { useGlobalScreenshotPrevention } from '@/hooks/useGlobalScreenshotPrevention';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
// const Stack = createNativeStackNavigator();

const Layout = () => {
  useEffect(() => {
   // SplashScreen.hide();
  }, []);

  // Enable global screenshot prevention for all screen pages
  useGlobalScreenshotPrevention();
  
  return (
      <Stack>  
        <Stack.Screen name="product" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="cart" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="addPostScreen" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="addCategoryScreen" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="itemList" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="cupens" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="termsAndConditions" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="support" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="about" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="editableProfileScreen" options={{ headerShown: false }}></Stack.Screen>
       
      </Stack>
    
  );
};


export default Layout;
