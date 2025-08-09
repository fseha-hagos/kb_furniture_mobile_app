import FloatingCustomerServiceButton from '@/app/components/FloatingCusSerButton';
import { CATEGORY_DATA, PRODUCTS_DATA } from '@/constants/configurations';
import { db } from '@/firebaseConfig';
import { useScreenshotPrevention } from '@/hooks/useScreenshotPrevention';
import { useThemeColor } from '@/hooks/useThemeColor';
import { categoriesType, productsType, slidesType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { DocumentData, collection, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, DimensionValue, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import CategoryCardView from '../../components/catagoryView';
import DataFetchError from '../../components/DataFetchError';
import ItemsCarousel from '../../components/itemCero';
import MarqueeText from '../../components/MarqueeText';
import NavBar from '../../components/navbar';
import ProductCards from '../../components/productCards';
import { handleFirebaseError } from '../../utils/firebaseErrorHandler';


interface ProductStackParamList {
  itemlist: { item: string };
}
   
interface SkeletonItemProps {
  width: DimensionValue;
  height: number;
  style?: ViewStyle;
}

const SkeletonItem = ({ width, height, style }: SkeletonItemProps) => (
  <View style={[{ width, height, backgroundColor: '#e0e0e0', borderRadius: 4 }, style]} />
);


const CategorySkeleton = () => {
  return (
    <View style={styles.categoriesContainer}>
      <SkeletonItem width={100} height={24} style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <SkeletonItem 
            key={index} 
            width={70} 
            height={70} 
            style={{ borderRadius: 35 }} 
          />
        ))}
      </View>
    </View>
  );
};

const SlidesSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      <SkeletonItem 
        width="100%" 
        height={200} 
        style={{ borderRadius: 12 }} 
      />
    </View>
  );
};

const ProductsSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      <SkeletonItem width={120} height={24} style={{ marginBottom: 12 }} />
      <View style={styles.skeletonGrid}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <View key={index} style={styles.skeletonCard}>
            {/* Image skeleton */}
            <View style={{ position: 'relative' }}>
              <SkeletonItem width="100%" height={200} style={{ borderRadius: 8 }} />
              {/* Like button skeleton */}
              <View style={{ position: 'absolute', top: 12, right: 12 }}>
                <SkeletonItem width={36} height={36} style={{ borderRadius: 18, backgroundColor: '#ececec' }} />
              </View>
            </View>
            {/* Title skeleton */}
            <SkeletonItem width="80%" height={14} style={{ marginTop: 12, borderRadius: 4 }} />
            {/* Description skeleton */}
            <SkeletonItem width="60%" height={11} style={{ marginTop: 6, borderRadius: 4 }} />
            {/* Price and rating skeleton */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 }}>
              <SkeletonItem width={50} height={14} style={{ borderRadius: 4 }} />
              <SkeletonItem width={30} height={14} style={{ borderRadius: 4 }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const HomeSkeleton = () => {
  return (
    <View style={styles.container}>
      <NavBar title="Home" showBack={false} showSearch={true} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={true} />
        }>
        {/* Slider Skeleton */}
        <View style={styles.skeletonContainer}>
          <SkeletonItem 
            width="100%" 
            height={200} 
            style={{ borderRadius: 12 }} 
          />
        </View>
        {/* Categories Skeleton */}
        <CategorySkeleton />
        {/* Products Grid Skeleton */}
        <ProductsSkeleton />
      </ScrollView>
    </View>
  );
};

const Layout = () => {
  const pageSize = 6;
  
  const [selectedCategory, setSelectedCategory] = React.useState<categoriesType | null>(null);
  const [sliderList, setSliderList] = useState<slidesType[]>([]);
  const [categoryList, setCategoryList] = useState<DocumentData[]>([]);
  const [latestItemLists, setLatestItemLists] = useState<productsType[]>([]);
  const [allProducts, setAllProducts] = useState<productsType[]>([]);

  const { preventScreenshot, allowScreenshot } = useScreenshotPrevention(true);

  const [lastItem, setLastItem] = useState<DocumentData[]>();
  const [refreshing, setRefreshing] = useState(false);
  const [startingDoc, setStartingDoc] = useState<DocumentData | null>(null);
  const [previousStart, setPreviousStart] = useState<DocumentData | null>(null);
  
  // Separate loading states for each component
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isSlidesLoading, setIsSlidesLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<productsType[]>([]);
  const [searchLoading , setSearchLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'tint');
  const subtextColor = useThemeColor({}, 'icon'); // Use icon color for subtext
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault');
  const tabIconSelectedColor = useThemeColor({}, 'tabIconSelected');
  const border = useThemeColor({}, 'border');
  
useEffect(() => {
  const loadInitialData = async () => {
    try {
      // Load categories
      setIsCategoryLoading(true);
      await getCategoryList();
      
      // Load slides
      setIsSlidesLoading(true);
      await getSliders();
      
      // Load latest items
      setIsProductsLoading(true);
      await getLatestItems();
    } catch (error) {
      handleFirestoreError(error);
    }
  };
  
  loadInitialData();
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
      await Promise.all([
        getCategoryList(),
        getSliders(),
        getLatestItems()
      ]);
    } catch (error) {
      handleFirestoreError(error);
    }
  };

  // Add a generic retry helper at the top, after imports
  const fetchWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 1500) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(fn, retries - 1, delay * 2); // Exponential backoff
      } else {
        throw error;
      }
    }
  };

  const getSliders = async () => {
    try {
      setSliderList([]);
      await fetchWithRetry(async () => {
        const querySnapshots = await getDocs(collection(db, "Sliders"));
        querySnapshots.forEach((doc) => {
          setSliderList(sliderList => [...sliderList, doc.data() as slidesType]);
        });
      });
    } catch (error) {
      handleFirestoreError(error);
    } finally {
      setIsSlidesLoading(false);
    }
  };

  const getCategoryList = async() => {
    try {
      setCategoryList([]);
      await fetchWithRetry(async () => {
        const querySnapShot = await getDocs(collection(db, `${CATEGORY_DATA}`));
        querySnapShot.forEach((doc) => {
          setCategoryList(categoryList => [...categoryList, doc.data()]);
        });
        // console.log("category lists : ", categoryList)
      });
    } catch (error) {
      handleFirestoreError(error);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const getLatestItems = async() => {
    try {
      await fetchWithRetry(async () => {
        const q = query(collection(db, `${PRODUCTS_DATA}`), limit(pageSize));
        const querySnapshot = await getDocs(q);

        setRefreshing(true);
        setLatestItemLists([]);
        setAllProducts([]);

        if (querySnapshot.empty) {
          setLatestItemLists([]);
          setAllProducts([]);
          setHasMoreData(false);
          return;
        }

        querySnapshot.forEach((doc) => {
          const productData = doc.data() as productsType;
          setLatestItemLists(prev => [...prev, productData]);
          setAllProducts(prev => [...prev, productData]);
        });
        // console.log("product lists : ", allProducts)
        setPreviousStart(querySnapshot.docs[(querySnapshot.docs.length - 1)-querySnapshot.docs.length]);
        setStartingDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMoreData(querySnapshot.docs.length === pageSize);
      });
    } catch (error) {
      handleFirestoreError(error);
    } finally {
      setRefreshing(false);
      setIsProductsLoading(false);
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
      setAllProducts(prev => [...prev, ...newItems]);
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
        <Text style={styles.noMoreDataText}>You've seen all available products</Text>
        <Text style={styles.noMoreDataSubtext}>Check back later for new arrivals!</Text>
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
            {searchLoading ? 'Searching...' : `Found ${searchResults.length} products`}
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


  const performSearch = async (searchText: string) => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    setSearchLoading(true);
    setSearchQuery(searchText);

    try {
      const searchQuery = searchText.toLowerCase().trim();
      const productsRef = collection(db, PRODUCTS_DATA);
      const searchQueryRef = query(
        productsRef,
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff'),
        limit(20)
      );

      const querySnapshot = await getDocs(searchQueryRef);
      const results: productsType[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data() as productsType);
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Create a debounced version of the search function
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      performSearch(text);
    }, 500),
    []
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleOnCategoryChanged = (item: categoriesType) => {
      setSelectedCategory(item); 
      if(item.name === "All") {
        setLatestItemLists(allProducts);
      } else {
        const filteredItems = allProducts.filter(product => 
          product.categoryId === item.categoryId
        );
        setLatestItemLists(filteredItems);
      }
    }

  
  const onSelect = () =>{
    console.log("selected category: ",selectedCategory);
  }

  const EmptyCategoryView = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Ionicons name="search-outline" size={60} color="#938F8F" />
        <Text style={styles.emptyTitle}>No Items Found</Text>
        <Text style={styles.emptySubtitle}>
          {selectedCategory?.name === "All" 
            ? "There are no products available at the moment."
            : `No items found in ${selectedCategory?.name} category.`}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            if (selectedCategory?.name === "All") {
              getLatestItems();
            } else {
              handleOnCategoryChanged(selectedCategory!);
            }
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // if (isLoading) {
  //   return <HomeSkeleton />;
  // }

  if (isOffline || error) {
    return (
      <View style={styles.container}>
        <NavBar title="Furniture" showBack={false} showSearch={true} />
        <DataFetchError
          message={isOffline ? "No internet connection. Please check your connection and try again." : error || "No data found. Please try again."}
          onRetry={handleRetry}
          // loading={isCategoryLoading || isProductsLoading || isSlidesLoading}
          icon={isOffline ? "wifi-off-outline" : "cloud-offline-outline"}
        />
      </View>
    );
  }

  return(
    <View style={styles.container}>
      <NavBar 
        title="Furniture" 
        showBack={false} 
        showSearch={true} 
        onSearch={handleSearch}
      />
      <FloatingCustomerServiceButton onPress={() => {
        // Navigate to chat screen or open modal
        // navigation.navigate('CustomerChat');
      }} />
      {searchQuery ? (
        <>
          {renderSearchState()}
          {searchLoading ? (
            <ProductsSkeleton />
          ) : (
          
            <FlatList
              data={searchResults}
              renderItem={({item}) => (
                <ProductCards 
                  item={item}
                />
              )}
              keyExtractor={(item, index) => item.productId?.toString() || index.toString()}
              numColumns={2}
              contentContainerStyle={styles.productGrid}
              ListEmptyComponent={
                <View style={styles.noProductTextContainer}>
                  <Text style={styles.noProductText}>
                    {searchLoading ? 'Searching...' : 'No products found'}
                  </Text>
                </View>
              }
            />
          )}
        </>
      ) : (
        <>
          {/* horizontal category */}
          <View style={styles.categoriesContainer}>
            {isCategoryLoading ? 
              <CategorySkeleton /> 
              :
              <FlatList 
                data={[
                  { categoryId: 'all', name: 'All', image: 'https://example.com/all-icon.png' },
                  ...categoryList
                ]} 
                renderItem={({item,index}) =>(
                
                  <CategoryCardView 
                    item={item as categoriesType}
                    selectedCategory={selectedCategory}
                    onSelect={item => {handleOnCategoryChanged(item)}}
                  />
                )} 
                keyExtractor={(item, index) => item.categoryId?.toString() || "cat-" + index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            }
          </View>

          {/* Marquee Text */}
          <View style={{
            height: 40,
            overflow: 'hidden',
          }}>
            <MarqueeText 
              text="🔥 Special Offer: Get 20% off on all furniture this week! 🎉 Free shipping on orders above Birr 500 💫"
              speed={30}
              backgroundColor={primaryColor}  
              textColor="white"
              fontSize={14}
              height={40}
            />
          </View>

          
          {isProductsLoading ? 
            <ProductsSkeleton /> 
            :
            <FlatList     
              numColumns={2}
              ListHeaderComponent={
                <>
                  <ItemsCarousel sliderList={sliderList}/>
                  <View style={{marginTop: 20, marginHorizontal: 18,}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", marginBottom: 15,}}>Latest Items</Text>
                  </View>
                </>
              }
              data={latestItemLists}
              renderItem={({item, index}) => (

                <ProductCards 
                  item={item as productsType}
                />
              )} 
              keyExtractor={(item, index) => item.productId?.toString() || "pro-" +index.toString()}
              ListFooterComponent={
                <>
                  {renderFooter()}
                  {renderNoMoreData()}
                  {renderErrorState()}
                </>
              }
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={getLatestItems} />
              }
            />  
          }
        </>
      )}
    </View>
  )
}


const Home = () => {
  return(
  <Layout />
  )  
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  categoriesContainer: {
    paddingHorizontal: 4,
    minHeight: 100,
   
  },
  scrollInnerContainer: {
    paddingBottom: 120,
  },
  skeletonContainer: {
    marginHorizontal: 16,
    marginTop: 24,
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
  },
  productGrid: {
    padding: 16,
    gap: 16,
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
  emptyContainer: {
    flex: 1,
    minHeight: 400,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#00685C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
  },
  loadingText: {
    marginLeft: 10,
    color: '#00685C',
    fontSize: 14,
    
  },
  noMoreDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
  },
  noMoreDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00685C',
    marginTop: 10,
  },
  noMoreDataSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  searchStateContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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


