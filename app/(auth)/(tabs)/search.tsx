import FloatingCustomerServiceButton from '@/app/components/FloatingCusSerButton';
import { PRODUCTS_DATA } from '@/constants/configurations';
import { db } from '@/firebaseConfig';
import { productsType } from '@/types/type';
import { LanguageCode } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DocumentData, collection, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Animated, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DataFetchError from '../../components/DataFetchError';
import Navbar from '../../components/navbar';
import ProductCards from '../../components/productCards';
import ProductComparison from '../../components/ProductComparison';
import { useProduct } from '../../context/productContext';
import { handleFirebaseError } from '../../utils/firebaseErrorHandler';

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
  const pageSize = 6;

  const { i18n, t } = useTranslation();
  const currentLang: LanguageCode = i18n.language as LanguageCode;


  const [refreshing, setRefreshing] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [startingDoc, setStartingDoc] = useState<DocumentData | null>(null);
  const [previousStart, setPreviousStart] = useState<DocumentData | null>(null);
  const [latestItemLists, setLatestItemLists] = useState<productsType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<productsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<productsType | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
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
    
    const result = await handleFirebaseError(error, {
      enableAppReload: true,
      showAlert: true
    });
    
    if (result.success) {
      // Retry was successful, reset error states
      setIsOffline(false);
      setError(null);
      return;
    }
    
    if (result.shouldReload) {
      // App will reload automatically, no need to set error states
      return;
    }
    
    // For other errors, show the offline state
    setIsOffline(true);
    setError("An error occurred while fetching data. Please check your internet connection and try again.");
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

      if (querySnapshot.empty) {
        setLatestItemLists([]);
        setHasMoreData(false);
        return;
      }

      querySnapshot.forEach((doc) => {
        const productData = doc.data() as productsType;
        setLatestItemLists(latestItemLists => [...latestItemLists, productData]);
      });

      setPreviousStart(querySnapshot.docs[(querySnapshot.docs.length - 1)-querySnapshot.docs.length]);
      setStartingDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMoreData(querySnapshot.docs.length === pageSize);
    } catch (error) {
      handleFirestoreError(error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreItems = async () => {
    if (isLoadingMore || !hasMoreData) return;
    
    setIsLoadingMore(true);
    try {
      if (!startingDoc) {
        setHasMoreData(false);
        return;
      }
      
      const nextQuery = query(
        collection(db, `${PRODUCTS_DATA}`),
        startAfter(startingDoc),
        limit(pageSize)
      );
      
      const nextSnapshot = await getDocs(nextQuery);
      
      if (nextSnapshot.empty) {
        setHasMoreData(false);
        return;
      }
      
      const newItems: productsType[] = [];
      nextSnapshot.forEach((doc) => {
        newItems.push(doc.data() as productsType);
      });
      
      setLatestItemLists(prev => [...prev, ...newItems]);
      setStartingDoc(nextSnapshot.docs[nextSnapshot.docs.length - 1]);
      setHasMoreData(newItems.length === pageSize);
      
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleEndReached = () => {
    if (hasMoreData && !isLoadingMore) {
      loadMoreItems();
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#00685C" />
        <Text style={styles.loadingText}>Loading more items...</Text>
      </View>
    );
  };

  const renderNoMoreData = () => {
    if (isLoadingMore || hasMoreData) return null;
    
    return (
      <View style={styles.noMoreDataContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#00685C" />
        <Text style={styles.noMoreDataText}>{t('noMoreProducts')}</Text>
        <Text style={styles.noMoreDataSubtext}>{t('checkLater')}</Text>
      </View>
    );
  };

  const renderErrorState = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchState = () => {
    if (!searchQuery) return null;
    
    return (
      <View style={styles.searchStateContainer}>
        <View style={styles.searchHeader}>
          <Text style={styles.searchResultsText}>
            {loading ? 'Searching...' : `Found ${searchResults.length} products`}
          </Text>
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
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

  if (isOffline || error) {
    return (
      <View style={styles.container}>
        <Navbar title="Search" showBack={false} showSearch={true} />
        <DataFetchError
          message={isOffline ? "No internet connection. Please check your connection and try again." : error || "No data found. Please try again."}
          onRetry={handleRetry}
          // loading={isProductsLoading}
          icon={isOffline ? "wifi-off-outline" : "cloud-offline-outline"}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar 
        title="All Products" 
        showSearch={true} 
        showBack={false} 
        onSearch={handleSearch}
      />

     <FloatingCustomerServiceButton
        onPressChat={() => Alert.alert('Live Chat', 'Live chat feature coming soon!')}
        onPressCart={() => router.push('/cart')}
     />
      
      {loading ? (
        <SearchSkeleton />
      ) : searchQuery ? (
        <>
          {renderSearchState()}
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
                <>
                  {renderFooter()}
                  {renderNoMoreData()}
                  {renderErrorState()}
                </>
              }
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              contentContainerStyle={{ paddingBottom: 120 }}
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
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#00685C',
    fontSize: 16,
  },
  noMoreDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMoreDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00685C',
    marginTop: 10,
  },
  noMoreDataSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00685C',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchStateContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  clearSearchButton: {
    padding: 5,
  },
});

export default Search;



