// import { useGlobalScreenshotPrevention } from '@/hooks/useGlobalScreenshotPrevention';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import React from 'react';


const PublicLayout = () => {
  const primaryColor = useThemeColor({}, 'primary');
  
  // Enable global screenshot prevention for all public pages
  // useGlobalScreenshotPrevention();
  
  return (
    <Stack

      screenOptions={{
        headerShown: true,
        headerTintColor: "#fffff0",
          headerStyle: {
            backgroundColor: primaryColor
          },
      
       
      }}>
        <Stack.Screen
        name="logoutHomeScreen"
        options={{
          headerShown: false
        }}></Stack.Screen>
       
      <Stack.Screen
        name="login"
        options={{
          headerTitle: 'Sign in',
        }}></Stack.Screen>
      <Stack.Screen
        name="register"
        options={{
          headerTitle: 'Create Account',
        }}></Stack.Screen>
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: 'Reset Password',
        }}></Stack.Screen>
      <Stack.Screen
        name="onBoarding"
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="languageOnboardingScreen"
        options={{
          headerShown: false,
        }}></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;
