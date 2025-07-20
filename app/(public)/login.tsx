import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as AuthSession from 'expo-auth-session';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      Toast.show({
        type: 'success',
        text1: "You have logged in successfuly",
        text2: "logged in"
    })
    } catch (err: any) 
    { Toast.show({
      type: 'error',
      text1: err.errors[0].message,
      text2: err.errors[0].message
  })
      setError(err.errors[0].message);

    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      if (!signIn) return;
      const redirectUrl = AuthSession.makeRedirectUri();
      await signIn.create({ strategy: 'oauth_google', redirectUrl });
    } catch (err: any) {
      setError(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')} resizeMode='center' />
      </View>
      <KeyboardAvoidingView style={styles.contentContainer}>
        <View style={styles.formBox}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subTitle}>Sign in and don't miss anything that can make your home stunning.</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#00685C" style={styles.inputIcon} />
            <TextInput
              autoCapitalize="none"
              placeholder="...@gmail.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={styles.inputField}
              keyboardType="email-address"
              placeholderTextColor="#aaa"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#00685C" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.inputField}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#00685C" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onSignInPress} style={styles.button} disabled={loading}>
            <Text style={{ fontSize: 17, color: 'white' }}>Login</Text>
          </TouchableOpacity>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>
          {/* Social login buttons can go here */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#fff', borderColor: '#4285F4' }]}
              onPress={onGoogleSignIn}
            >
              <Ionicons name="logo-google" size={22} color="#4285F4" />
              <Text style={styles.socialBtnText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signinContainer}>
            <Link href="/reset" asChild>
              <Pressable>
                <Text style={styles.linkText}>Forgot password?</Text>
              </Pressable>
            </Link>
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
              <Text>Don't have an account?</Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text style={styles.signin}> Sign up</Text>
                </Pressable>
              </Link>
            </View>
            {/* <TouchableOpacity style={styles.backHomeBtn} onPress={() => navigation.navigate('home' as never)}>
              <Ionicons name="arrow-back" size={18} color="#00685C" />
              <Text style={styles.backHomeText}>Back to Home</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: 110,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subTitle: {
    marginBottom: 18,
    textAlign: 'center',
    color: 'rgba(0,0,0,0.7)',
    fontSize: 15,
  },
  errorText: {
    color: '#DC3545',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 6,
  },
  inputField: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#00685C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    borderRadius: 18,
    marginBottom: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
    fontWeight: '500',
  },
  signinContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#00685C',
    fontWeight: '500',
    marginTop: 8,
  },
  signin: {
    color: '#00685C',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  backHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    padding: 8,
  },
  backHomeText: {
    color: '#00685C',
    marginLeft: 4,
    fontWeight: '500',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    marginBottom: 4,
  },
  socialBtnText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
  },
});

export default Login;
