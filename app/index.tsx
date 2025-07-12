import { ActivityIndicator, Text, View, StyleSheet, Image } from 'react-native';
import React, { Component } from 'react';


import * as SecureStore from 'expo-secure-store';
import { Slot, useRouter, useSegments, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';



const StartPage = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
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
    backgroundColor: "#00685C"
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