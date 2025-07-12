import { useSignUp } from '@clerk/clerk-expo';
import { Link, Stack, useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      alert(err.errors[0].message);
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
      finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
   
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
        
        <View style={{paddingLeft: 19, paddingRight: 19}}>
      <Image style={{width: "100%", height: 180, marginBottom:20}} source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')} resizeMode='center' />
    
      </View>
        <KeyboardAvoidingView
  style={styles.contentContainer}
>
           <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subTitle}>sign up and don't miss any think that can make your home stunning.</Text>
          <TextInput autoCapitalize="none" placeholder="...@gmail.com" value={emailAddress}  onPressIn={Keyboard.dismiss} onChangeText={setEmailAddress} style={styles.inputField} />
          <TextInput placeholder="password" value={password} onPressIn={Keyboard.dismiss} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
          <TouchableOpacity  onPress={onSignUpPress} style={styles.button}><Text style={{fontSize:17, color:"white"}}>Sing up</Text></TouchableOpacity>
         
          <View style={styles.signinContainer}>

          <View style={{display: 'flex', flexDirection : "row", marginTop:20}}>
          <Text>Already have an account?</Text>
          <Link href="/login" asChild>
          
        <Pressable >
         <Text style={styles.signin}>Sign in</Text>
        </Pressable>
      </Link>
      </View>
          </View>
          
          </KeyboardAvoidingView>
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <TextInput value={code} placeholder="Code..." style={styles.inputField} onChangeText={(code) => setCode(code)} />
          </View>
          <TouchableOpacity  onPress={onPressVerify} style={styles.button}><Text style={{fontSize:17, color:"white"}}>Verify Email</Text></TouchableOpacity>
           </>
      )}
    
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer :{
    marginTop: 10,
    padding: 20,
   flex: 1,
   justifyContent: "center",
   overflow: "scroll",
   borderTopWidth: 2,
   borderLeftWidth: 2,
   borderRightWidth: 2,
   borderColor: "rgba(0,0,0,0.3)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  title : {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  subTitle : {
    marginTop: 0,
    marginBottom: 15,
    padding: 10,
    textAlign: "center",
    color : "rgba(0,0,0,0.7)"
  },
  inputField: {
    marginVertical: 8,
    height: 47,
    borderWidth: 1,
    borderColor: '#00685C',
    borderRadius: 18,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 12,
    backgroundColor: "#00685C",
    alignItems: "center",
    justifyContent: "center",
   
    padding: 13,
    borderRadius: 18,
  },
  signinContainer : {
   alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15
   
  },
  signin : {
    color: "#00685C",
    fontStyle: 'italic'
  }
});

export default Register;
