//import liraries

import Navbar from '@/app/components/navbar';
import ProductCards from '@/app/components/productCards';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DocumentData } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../context/cartContext';

const { width, height } = Dimensions.get('window');



// create a component
const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<DocumentData[]>([]);
  const { likedProducts } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const router = useRouter();

  const primaryColor = useThemeColor({}, 'primary');

  useEffect(() => {
    // Animate the component on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const EmptyFavoritesState = () => (
    <Animated.View 
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.gradientBackground}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
        {/* Main content */}
        <View style={styles.emptyContent}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.iconGradient}
            >
              <Ionicons name="heart" size={50} color="white" />
            </LinearGradient>
          </View>
          
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start liking products to build your collection
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="heart-outline" size={18} color="#FF6B6B" />
              </View>
              <Text style={styles.featureText}>Like products you love</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="cart-outline" size={16} color="#45B7D1" />
              </View>
              <Text style={styles.featureText}>Easy access to favorites</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/(auth)/(tabs)/home')}
          >
            <LinearGradient
              colors={[primaryColor, primaryColor]}
              style={styles.exploreButtonGradient}
            >
              <Ionicons name="search" size={18} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.exploreButtonText}>Explore Products</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderProduct = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={[
        styles.productContainer,
        {
          opacity: fadeAnim,
          transform: [
            { 
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }
          ]
        }
      ]}
    >
      <ProductCards item={item} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Navbar title="My Favorites" showSearch={false} showBack={false} />
      <Text style={styles.simpleTitle}>My Favorites</Text>
      {likedProducts && likedProducts.length > 0 ? (
        <FlatList
          data={likedProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => item.productId || `favorite-${index}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#00685C']}
              tintColor="#00685C"
            />
          }
          ListEmptyComponent={<EmptyFavoritesState />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#00685C']}
              tintColor="#00685C"
            />
          }
        >
          <EmptyFavoritesState />
        </ScrollView>
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  headerRight: {
    alignItems: 'center',
  },
  favoritesCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  favoritesLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  productsList: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productContainer: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    minHeight: height * 0.7,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: '30%',
    left: '20%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(69, 183, 209, 0.1)',
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  exploreButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00685C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  simpleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
});

//make this component available to the app

