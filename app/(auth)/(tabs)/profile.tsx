import { useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CacheManager from '../../components/CacheManager';
import CacheStatusIndicator from '../../components/CacheStatusIndicator';
import Navbar from '../../components/navbar';
import { useAuth } from '../../context/cartContext';


interface ProductStackParamList {
  addpost : {item: null }; // Assuming Product is defined elsewhere
}

const Profile = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const navigation = useNavigation<NavigationProp<ProductStackParamList>>();
  
  // Cache manager state
  const [showCacheManager, setShowCacheManager] = useState(false);
  const { refreshCart } = useAuth();

  const ProfileMenu = [
    {
      id: 1,
      name: "My Favorites",
      path: "Favorites",
      icon: <Ionicons name="heart-sharp" size={16} color="white" style={styles.shoppingBagIcon}/>
    },
    {
      id : 2,
      name: "My Cupen",
      path: "cupens",
      icon: <Image
      source={require('@/assets/images/shopping-bag.png')}
      style={styles.shoppingBagIcon}
     resizeMode="contain"
     />
    },
    {
      id : 3,
      name: "Clear Catch",
      path: "clear",
      icon: <Image
      source={require('@/assets/images/shopping-bag.png')}
      style={styles.shoppingBagIcon}
     resizeMode="contain"
     />
    },
    {
      id : 4,
      name: "Terms and Conditions",
      path: "terms",
      icon: <Image
      source={require('@/assets/images/shopping-bag.png')}
      style={styles.shoppingBagIcon}
     resizeMode="contain"
     />
    },
    // {
    //   id : 5,
    //   name: "Add Product",
    //   path: "addProduct",
    //   icon: <Image
    //   source={require('./assets/images/shopping-bag.png')}
    //   style={styles.shoppingBagIcon}
    //  resizeMode="contain"
    //  />
    // },
  ]

  const onSaveUser = async () => {
    try {
      // This is not working!
      const result = await user?.update({
        firstName: 'John',
        lastName: 'Doe',
      });
      console.log('🚀 ~ file: profile.tsx:16 ~ onSaveUser ~ result:', result);
    } catch (e) {
      console.log('🚀 ~ file: profile.tsx:18 ~ onSaveUser ~ e', JSON.stringify(e));
    }
  };

  // const handleOnMenuPressed = (path: string) =>{
  //   console.log(path);

  //   if(path === "clear"){
  //     console.log("clear all catch");
  //   }
  //   else{
  //     try{
  //       navigation.navigate(path,{item: null})
  //     }catch(error){
  //       console.log(error)
  //     }
      
  //   }
    
  // }
  const call = async () => {
    Linking.openURL('tel:+251948491265');
  }
  const telegram = async () => {
    const linkk = 'https://t.me/+251962588731/'
      Linking.openURL(linkk)
  }
  const facebook = async () => {
    const linkk = 'https://facebook.com/'
      Linking.openURL(linkk)
  }
  const insta = async () => {
    const linkk = 'https://t.me/+251962588731/'
      Linking.openURL(linkk)
  }
  const tiktok = async () => {
    const linkk = 'https://t.me/+251962588731/'
      Linking.openURL(linkk)
  }
  const handleSignOut = async () => {
    await signOut();
    console.log("You have signed out successfully.");
  };

  // Animated Button Component
  const AnimatedButton = ({ 
    icon, 
    text, 
    onPress, 
    gradientColors = ['#00685C', '#00897B'] as const,
    iconColor = 'white',
    delay = 0 
  }: {
    icon: React.ReactElement;
    text: string;
    onPress: () => void;
    gradientColors?: readonly [string, string];
    iconColor?: string;
    delay?: number;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
      // Staggered entrance animation
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.animatedButtonContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={styles.animatedButton}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                {icon}
              </View>
              <Text style={styles.animatedButtonText}>{text}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
                style={styles.chevronIcon}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <View style={styles.scrollContainer}>
      <Navbar title="Profile " showBack ={true} showSearch = {false}/>
      <View style={styles.profileContainer}>
        <Image source={require("@/assets/logo/kb-furniture-high-resolution-logo-transparent.png")} style={styles.profileImg}/>
        <Text style={{fontWeight: 'bold', color:"white"}} onPress={call}>+251948491265</Text>
        <View style={styles.contactContainer} >
          <TouchableOpacity style={styles.contactIcons} onPress={facebook}>
           <Image source={require("@/assets/logo/fb.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactIcons} onPress={telegram}>
           <Image source={require("@/assets/logo/telegram.png")} style={styles.icon}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactIcons} onPress={insta}>
           <Image source={require("@/assets/logo/insta.png")} style={styles.icon}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactIcons} onPress={tiktok}>
           <Image source={require("@/assets/logo/google.png")} style={styles.icon}/>
          </TouchableOpacity>
        </View>
        
        {/* Cache Status Indicator */}
        <View style={styles.cacheStatusContainer}>
          <CacheStatusIndicator
            onPress={() => setShowCacheManager(true)}
            showDetails={true}
          />
        </View>
      </View>
      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 90}}
        showsVerticalScrollIndicator={false}
        >

      
     

    
         <View style={[{ width: "100%"},styles.menuContainer]}>
          <AnimatedButton
            icon={<Ionicons name="add-circle-outline" size={22} color="white" />}
            text="Add Product"
            onPress={() => router.push("/addPostScreen")}
            gradientColors={['#00685C', '#00897B']}
            delay={100}
          />
          
          <AnimatedButton
            icon={<Ionicons name="folder-open" size={22} color="white" />}
            text="Add Category"
            onPress={() => router.push("/addCategoryScreen")}
            gradientColors={['#00685C', '#00897B']}
            delay={200}
          />
          
          <AnimatedButton
            icon={<Ionicons name="heart" size={22} color="white" />}
            text="My Favorites"
            onPress={() => router.push("/favorites")}
            gradientColors={['#00685C', '#00897B']}
            delay={300}
          />
          
          <AnimatedButton
            icon={<Ionicons name="ticket" size={22} color="white" />}
            text="My Cupen"
            onPress={() => router.push("/cupens")}
            gradientColors={['#00685C', '#00897B']}
            delay={400}
          />
          
          <AnimatedButton
            icon={<Ionicons name="trash" size={22} color="white" />}
            text="Clear Cache"
            onPress={() => setShowCacheManager(true)}
            gradientColors={['#00685C', '#00897B']}
            delay={500}
          />
          
          <AnimatedButton
            icon={<Ionicons name="document-text" size={22} color="white" />}
            text="Terms and Conditions"
            onPress={() => router.push("/termsAndConditions")}
            gradientColors={['#00685C', '#00897B']}
            delay={600}
          />
          
          <AnimatedButton
            icon={<Ionicons name="log-out" size={22} color="white" />}
            text="Logout"
            onPress={handleSignOut}
            gradientColors={['#DC3545', '#C82333']}
            delay={700}
          />
         </View>
         </ScrollView>
         
         {/* Cache Manager Modal */}
         <CacheManager
           visible={showCacheManager}
           onClose={() => setShowCacheManager(false)}
           onCacheCleared={() => {
             // Refresh cart and other data after cache is cleared
             refreshCart?.();
             setShowCacheManager(false);
           }}
         />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer : {
    flex: 1,
  },

  contactContainer :{
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    alignItems:"center",
    marginTop: 5,
    gap: 14
  },
  contactIcons : {
    width: 40,
    height:40,
    
  },
  icon : {
    width: 40,
    height:40,
    resizeMode: "cover"
  },
  profileContainer: {
    width: "98%",
    borderRadius: 10,
    height: 190,
    marginHorizontal: 'auto',
   backgroundColor: "#00685C",
    marginTop: 3,
    alignItems: 'center',
    justifyContent: "center",
    elevation: 30,
    shadowColor: 'black',
    shadowOffset: {width: 3, height: -6},
   
  },
  profileImg : {
    resizeMode:"contain",
    height: 80,
    marginBottom:10
  },
  user : {

  },
  menuContainer : {
   
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%"
  },
  button: {
    
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#00685C',
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  shoppingBagIcon: {
   
    tintColor: 'white',
    color: "white",
    marginRight: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  // Animated Button Styles
  animatedButtonContainer: {
    marginTop: 12,
    width: '100%',
  },
  animatedButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  buttonIcon: {
    marginRight: 0,
  },
  animatedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  cacheStatusContainer: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  
});

export default Profile;
