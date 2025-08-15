import { useThemeColor } from '@/hooks/useThemeColor';
import { LANG_KEY } from '@/utils/i18n';
import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

const StartPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');

  const [loading, setLoading] = useState(true);
  const [hasLanguage, setHasLanguage] = useState(false);

  useEffect(() => {
    const checkLang = async () => {
      const lang = await AsyncStorage.getItem(LANG_KEY);
      setHasLanguage(!!lang);
      setLoading(false);
    };
    checkLang();
  }, []);



  useEffect(() => {
    if (!isLoaded) return;

    // Add a small delay to show the loading screen
    const timer = setTimeout(() => {
      if (hasLanguage) {
        router.replace('/(auth)/(tabs)/home');
      } else {
        router.replace('/languageOnboardingScreen');
      }
    }, 1500); // Show loading screen for 1.5 seconds

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  //   // Add a small delay to show the loading screen
  //   const timer = setTimeout(() => {
  //     if (isSignedIn) {
  //       router.replace('/(auth)/(tabs)/home');
  //     } else {
  //       router.replace('/onBoarding');
  //     }
  //   }, 1500); // Show loading screen for 1.5 seconds

  //   return () => clearTimeout(timer);
  // }, [isLoaded, isSignedIn]);

  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: primaryColor }]}>
        <View style={[styles.imageContainer,{ overflow: 'hidden' }]}>
          <Image 
            style={{width: "100%", height: 180}} 
            source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')} 
            resizeMode='center' 
          />
          <ActivityIndicator size={'large'} color={"#FBB04B"} style={{}}/>
        </View>
      </View>
    </>
  );
};

export default StartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#00685C"
},
imageContainer : {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent:"center",
    
    padding: 20,
    
    marginBottom: 50,
   
    position: "relative"
}
})