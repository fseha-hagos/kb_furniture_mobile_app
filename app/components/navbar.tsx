import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/cartContext';

const { width } = Dimensions.get('window');

interface myprops{
  title: string;
  showBack: boolean;
  showSearch: boolean;
  onSearch?: (query: string) => void;
}

interface ProductStackParamList {
  itemlist: { item: string };
}

// Dynamic advertising messages
const advertisingMessages = [
  "🔥 Special Offer: 20% off all furniture!",
  "🎉 Free shipping on orders above $500",
  "💫 New arrivals every week",
  "🌟 Premium quality furniture at best prices",
  "✨ Limited time deals - Shop now!",
  "🎯 Best furniture collection 2024",
  "💎 Luxury furniture for your home",
  "🏆 Customer favorite - Top rated"
];

const DynamicAdText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Smooth slide and fade transition
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change text while invisible
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % advertisingMessages.length
        );
        
        // Slide back and fade in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.Text 
      style={[
        styles.advertisingText,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      {advertisingMessages[currentIndex]}
    </Animated.Text>
  );
};

const Navbar = ({ title, showBack = false, showSearch = false, onSearch } :myprops) => {

  const {carts} = useAuth();
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<ProductStackParamList>>();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const searchContainerAnim = useRef(new Animated.Value(0)).current;
  const searchIconAnim = useRef(new Animated.Value(0)).current;

  const handleMyCart = () => {
    router.push("/cart")
  }

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    Animated.parallel([
      Animated.timing(searchContainerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(searchIconAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    Animated.parallel([
      Animated.timing(searchContainerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(searchIconAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const clearSearch = () => {
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
    searchInputRef.current?.focus();
  };

  return (
    <View>
      <LinearGradient
        colors={['#00685C', '#00897B']}
        style={styles.navBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {showBack ? (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.logoContainer}>
            <Image
              source={require("@/assets/logo/kb-furniture-high-resolution-logo-transparent.png")}
              style={styles.menuIcon}
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <DynamicAdText />
        </View>
        
        <TouchableOpacity style={styles.cartIcon} onPress={handleMyCart}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.cartGradient}
          >
            <MaterialCommunityIcons name="cart-outline" size={24} color="#00685C" />
            {carts && carts.length > 0 && (
              <View style={styles.cartCount}>
                <Text style={styles.cartCountText}>{carts.length}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    
      {showSearch && (
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              transform: [
                {
                  scale: searchContainerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  }),
                },
                {
                  translateY: searchContainerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2],
                  }),
                },
              ],
              shadowOpacity: searchContainerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={isSearchFocused ? ['#FFFFFF', '#F8F9FA'] : ['#F8F9FA', '#FFFFFF']}
            style={styles.searchGradient}
          >
            <Animated.View
              style={[
                styles.searchIconContainer,
                {
                  transform: [
                    {
                      scale: searchIconAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons 
                name="search" 
                size={20} 
                color={isSearchFocused ? "#00685C" : "#9CA3AF"} 
              />
            </Animated.View>
            
            <TextInput 
              ref={searchInputRef}
              placeholder='Search for furniture...' 
              placeholderTextColor="#9CA3AF"
              style={[
                styles.searchInput,
                { color: isSearchFocused ? '#1F2937' : '#6B7280' }
              ]}
              onChangeText={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              value={searchText}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            {searchText.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
            
            {searchText.length === 0 && (
              <TouchableOpacity 
                style={styles.voiceButton}
                onPress={() => {
                  // Voice search functionality can be added here
                  console.log('Voice search pressed');
                }}
              >
                <Ionicons name="mic-outline" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 90,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  menuIcon: {
    width: 90,
    height: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 2,
  },
  advertisingText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  cartIcon: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    overflow: 'visible',
    position: 'relative',
  },
  cartGradient: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cartCount: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cartCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    margin: 10,
    marginHorizontal: 6,
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchIconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  voiceButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default Navbar;


