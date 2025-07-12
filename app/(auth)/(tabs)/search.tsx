import { PRODUCTS_DATA } from '@/constants/configurations';
import { db } from '@/firebaseConfig';
import { productsType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DocumentData, collection, disableNetwork, enableNetwork, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Navbar from '../../components/navbar';
import NetworkError from '../../components/NetworkError';
import ProductCards from '../../components/productCards';
import ProductComparison from '../../components/ProductComparison';
import { useProduct } from '../../context/productContext';

// create a component
const SearchSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
   
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Animated.View key={index} style={[styles.skeletonCard, { opacity }]}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonPrice} />
                <View style={styles.skeletonRating}>
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <View key={i} style={styles.skeletonStar} />
                  ))}
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
   
  );
};

const Search = () => {
  const pageSize = 14;
  const [refreshing, setRefreshing] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [startingDoc, setStartingDoc] = useState<DocumentData | null>(null);
  const [previousStart, setPreviousStart] = useState<DocumentData | null>(null);
  const [latestItemLists, setLatestItemLists] = useState<productsType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<productsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<productsType | null>(null);
  const router = useRouter();
  const { addToRecentlyViewed } = useProduct();
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getLatestItems(),
        ]);
      } catch (error) {
        console.error('Error loading products data:', error);
      } finally {
        setIsProductsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFirestoreError = async (error: any) => {
    console.error("Firestore error:", error);
    if (error.code === 'failed-precondition' || error.code === 'unavailable') {
      setIsOffline(true);
      setError("Your device doesn't have a healthy internet connection at the moment. The app will operate in offline mode until it can successfully connect to the server.");
      try {
        await disableNetwork(db);
        await enableNetwork(db);
      } catch (e) {
        console.error("Error reconnecting to Firestore:", e);
      }
    } else if (error.message?.includes("Backend didn't respond within 10 seconds")) {
      setIsOffline(true);
      setError("The server is taking too long to respond. This might be due to a slow internet connection. Please try again when your connection is more stable.");
    } else {
      setError("An error occurred while fetching data. Please check your internet connection and try again.");
    }
  };

  const handleRetry = async () => {
    setIsOffline(false);
    setError(null);
    try {
      await getLatestItems();
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  const getLatestItems = async () => {
    try {
      setRefreshing(true);
      setLatestItemLists([]);
      
      const q = query(collection(db, `${PRODUCTS_DATA}`), limit(pageSize));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const productData = doc.data() as productsType;
        setLatestItemLists(latestItemLists => [...latestItemLists, productData]);
      });

      setPreviousStart(querySnapshot.docs[(querySnapshot.docs.length - 1)-querySnapshot.docs.length]);
      setStartingDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      handleFirestoreError(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async (queryText: string) => {
    setSearchQuery(queryText);
    if (!queryText.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const productsRef = collection(db, PRODUCTS_DATA);
      const searchText = String(queryText).toLowerCase().trim();
      const q = query(
        productsRef,
        where('title', '>=', searchText),
        where('title', '<=', searchText + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
        } as productsType;
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: productsType) => {
    setSelectedProduct(product);
    addToRecentlyViewed(product);
    router.push({
      pathname: "/product",
      params: { productData: JSON.stringify(product) }
    });
  };

  const handleLoadMore = async (side: number) => {
    let nextSnapshot:DocumentData | undefined = undefined;
    
    setRefreshing(true);
    if(side===1){
      console.log("previousStart:  ",previousStart)
      if (!previousStart){
        getLatestItems();
        return;
      }
      setLatestItemLists([]);
      const prevQuery = query(
        collection(db, 'FurnitureData'),
          startAfter(previousStart),
          limit(pageSize)
      )
       nextSnapshot = await getDocs(prevQuery);
    }
    else{
      if (!startingDoc){
        console.log("there is no data here")
        getLatestItems();
        return;
      } 
      
      setLatestItemLists([]);
      let nextQuery = query(
        collection(db, 'FurnitureData'),
        startAfter(startingDoc),
        limit(pageSize)
    );
     nextSnapshot = await getDocs(nextQuery);
     if(nextSnapshot.size === 0){
      getLatestItems();
      return;
     } 
    }

    // Process data as before
    nextSnapshot.forEach((doc:DocumentData) => {
      const productData = doc.data() as productsType
      setLatestItemLists(latestItemLists => [...latestItemLists, productData]);
    });
    
  
    setPreviousStart(nextSnapshot.docs[(nextSnapshot.docs.length - 1)-nextSnapshot.docs.length]);
    setStartingDoc(nextSnapshot.docs[nextSnapshot.docs.length - 1]); // Update cursor
    setRefreshing(false);
  };

  if (isOffline) {
    return (
      <View style={styles.container}>
        <Navbar title="Search" showBack={false} showSearch={true} />
        <NetworkError onRetry={handleRetry} message={error || undefined} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar 
        title="All Products" 
        showSearch={true} 
        showBack={true} 
        onSearch={handleSearch}
      />
      
      {loading ? (
        <SearchSkeleton />
      ) : searchQuery ? (
        <>
          <FlatList
            data={searchResults}
            renderItem={({item}) => (
              <ProductCards 
                item={item}
              />
            )}
            keyExtractor={(item) => item.productId}
            numColumns={2}
            contentContainerStyle={styles.productGrid}
            ListEmptyComponent={
              <View style={styles.noProductTextContainer}>
                <Text style={styles.noProductText}>No products found</Text>
              </View>
            }
          />
          {selectedProduct && (
            <ProductComparison currentProduct={selectedProduct} />
          )}
        </>
      ) : (
        <>
          {refreshing ? (
            <SearchSkeleton />
          ) : latestItemLists.length > 0 ? (
            <FlatList 
              numColumns={2}
              data={latestItemLists} 
              renderItem={({item, index}) => (
                <ProductCards 
                  item={item as productsType}
                />
              )} 
              keyExtractor={item => item.productId}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <View style={styles.scrollInnerContainer}>
                  <View style={styles.navigationContainer}>
                    <TouchableOpacity 
                      style={styles.navigationButton} 
                      onPress={() => handleLoadMore(1)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#00685C', '#00897B']}
                        style={styles.navigationGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="chevron-back" size={20} color="white" />
                        <Text style={styles.navigationText}>Previous</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <View style={styles.pageIndicatorContainer}>
                      <View style={[styles.pageIndicator, styles.activeIndicator]} />
                      <View style={styles.pageIndicator} />
                      <View style={styles.pageIndicator} />
                      <View style={styles.pageIndicator} />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.navigationButton} 
                      onPress={() => handleLoadMore(2)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#00685C', '#00897B']}
                        style={styles.navigationGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.navigationText}>Next</Text>
                        <Ionicons name="chevron-forward" size={20} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={getLatestItems} />
              }
            />
          ) : (
            <View style={styles.noProductTextContainer}>
              <Text style={styles.noProductText}>Sorry, there are no products available.</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 60,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollInnerContainer: {
    paddingBottom: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  navigationButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  navigationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  navigationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pageIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  activeIndicator: {
    backgroundColor: '#00685C',
    width: 24,
  },
  noProductTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%"
  },
  noProductText: {
    color: "#757575",
    fontSize: 16,
  },
  productGrid: {
    padding: 16,
    gap: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00685C',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  skeletonContainer: {
    flex: 1,
    padding: 16,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  skeletonCard: {
    width: '47%',
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#d0d0d0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  skeletonContent: {
    padding: 12,
  },
  skeletonTitle: {
    width: '80%',
    height: 20,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonPrice: {
    width: '40%',
    height: 20,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonRating: {
    flexDirection: 'row',
    gap: 4,
  },
  skeletonStar: {
    width: 16,
    height: 16,
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
  },
});

export default Search;



