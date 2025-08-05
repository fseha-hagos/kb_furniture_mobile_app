import { useThemeColor } from '@/hooks/useThemeColor';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn, setActive } = useSignIn();

  const primaryColor = useThemeColor({}, 'primary');

  // Request a password reset code by email
  const onRequestReset = async () => {
    try {
      setError('');
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      setError(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      setError('');
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });
      alert('Password reset successfully');
      await setActive!({ session: result!.createdSessionId });
    } catch (err: any) {
      setError(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />
      <View
        style={styles.contentContainer}
      >
        <View style={styles.formBox}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subTitle}>Enter your email to receive a reset code.</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {!successfulCreation && (
            <>
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
              <TouchableOpacity onPress={onRequestReset} style={[{backgroundColor: primaryColor}, styles.button]}>
                <Text style={{ fontSize: 17, color: 'white' }}>Send Reset Code</Text>
              </TouchableOpacity>
            </>
          )}
          {successfulCreation && (
            <>
              <Text style={styles.subTitle}>Enter the code sent to your email and your new password.</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="key-outline" size={20} color="#00685C" style={styles.inputIcon} />
                <TextInput
                  value={code}
                  placeholder="Reset Code"
                  style={styles.inputField}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  placeholderTextColor="#aaa"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#00685C" style={styles.inputIcon} />
                <TextInput
                  placeholder="New password"
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
              <TouchableOpacity onPress={onReset} style={[{backgroundColor: primaryColor}, styles.button]}>
                <Text style={{ fontSize: 17, color: 'white' }}>Set New Password</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
   
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    borderRadius: 18,
    marginBottom: 10,
  },
});

export default PwReset;
