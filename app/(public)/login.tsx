import { useSignIn } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';


const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <View style={{paddingLeft: 19, paddingRight: 19}}>
      <Image style={{width: "100%", height: 180, marginBottom:20}} source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')} resizeMode='center' />
    
      </View>
      <KeyboardAvoidingView
  style={styles.contentContainer}
>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subTitle}>sign up and don't miss any think that can make your home stunning.</Text>
          <TextInput autoCapitalize="none" placeholder="...@gmail.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
          <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
          <TouchableOpacity  onPress={onSignInPress} style={styles.button}><Text style={{fontSize:17, color:"white"}}>Login</Text></TouchableOpacity>
          <View style={styles.signinContainer}>
          <Link href="/reset" asChild>
        <Pressable >
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
         <View style={{display: 'flex', flexDirection : "row", marginTop:20}}>
          <Text>Don't have an account?</Text>
          <Link href="/register" asChild>
          
        <Pressable >
        <Text style={styles.signin}>Sign up</Text>
        </Pressable>
      </Link>
      </View>
           
          </View>
          </KeyboardAvoidingView>

   
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
    borderTopRightRadius: 20,
   
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
   
    justifyContent: "center",
    marginTop: 15
   
  },
  signin : {
    color: "#00685C",
    fontStyle: 'italic'
  }
});

export default Login;
