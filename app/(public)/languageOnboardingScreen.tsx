import { useThemeColor } from '@/hooks/useThemeColor';
import { LANG_KEY, setLanguage } from '@/utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LanguageCode = 'en' | 'am';



const LanguageOnboardingScreen = () => {
    const router = useRouter()
    const primaryColor = useThemeColor({}, 'primary');
    const secondaryColor = useThemeColor({}, 'secondary');
  const handleSelect = async (lang: LanguageCode) => {
    await setLanguage(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
    router.replace('/onBoarding'); // Navigate to main app stack
  };

  return (
    <View style={[styles.container, {backgroundColor: primaryColor}]}>
      <View style={[styles.imageContainer,{ overflow: 'hidden' }]}>
          <Image
            style={{width: "100%", height: 180}} 
            source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')} 
            resizeMode='center' 
          />

        </View>
      <Text style={styles.title}>Choose Your Language</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('en')}>
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('am')}>
        <Text style={styles.buttonText}>አማርኛ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22,color: 'white', fontWeight: 'bold', marginBottom: 20 },
  button: { 
    marginHorizontal: 20,
    width: '90%',
    marginTop: 20,
    backgroundColor: "#E87E1C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center" },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  imageContainer : { width: "100%", padding: 20, marginBottom: 10, }
});

export default LanguageOnboardingScreen;
