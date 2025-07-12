import { CATEGORY_DATA, PRODUCTS_DATA } from '@/constants/configurations';
import { db } from '@/firebaseConfig';
import { categoriesType, productsType, slidesType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { DocumentData, collection, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, DimensionValue, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import CategoryCardView from '../../components/catagoryView';
import ItemsCarousel from '../../components/itemCero';
import MarqueeText from '../../components/MarqueeText';
import NavBar from '../../components/navbar';
import NetworkError from '../../components/NetworkError';
import ProductCards from '../../components/productCards';

      

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
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <SkeletonItem 
            key={index} 
            width={80} 
            height={80} 
            style={{ borderRadius: 40 }} 
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
                <SkeletonItem width="100%" height={150} style={{ borderRadius: 8 }} />
                <SkeletonItem width="80%" height={20} style={{ marginTop: 8 }} />
                <SkeletonItem width="40%" height={20} style={{ marginTop: 4 }} />
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
        <View style={styles.categoriesContainer}>
          <SkeletonItem width={100} height={24} style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <SkeletonItem 
                key={index} 
                width={80} 
                height={80} 
                style={{ borderRadius: 40 }} 
              />
            ))}
          </View>
        </View>

        {/* Products Grid Skeleton */}
        <View style={styles.skeletonContainer}>
          <SkeletonItem width={120} height={24} style={{ marginBottom: 12 }} />
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <View key={index} style={styles.skeletonCard}>
                <SkeletonItem width="100%" height={150} style={{ borderRadius: 8 }} />
                <SkeletonItem width="80%" height={20} style={{ marginTop: 8 }} />
                <SkeletonItem width="40%" height={20} style={{ marginTop: 4 }} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Layout = () => {
  const pageSize = 14;
  const navigation = useNavigation<NavigationProp<ProductStackParamList>>();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<categoriesType | null>(null);
  const [sliderList, setSliderList] = useState<slidesType[]>([]);
  const [categoryList, setCategoryList] = useState<DocumentData[]>([]);
  const [latestItemLists, setLatestItemLists] = useState<productsType[]>([]);
  const [allProducts, setAllProducts] = useState<productsType[]>([]);

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
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  
  // Scroll animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(1)).current;
  const categoryOpacity = useRef(new Animated.Value(1)).current;
  const categoryContainerHeight = useRef(new Animated.Value(126)).current; // 110 + 16 margin
  const marqueeHeight = useRef(new Animated.Value(40)).current;
 
  
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
    
    // Check for specific Firebase connection errors
    if (error.code === 'failed-precondition' || 
        error.code === 'unavailable' || 
        error.message?.includes("Backend didn't respond within 10 seconds") ||
        error.message?.includes("Could not reach Cloud Firestore backend")) {
      
      // Redirect to not-found page for connection errors
      router.push('/+not-found');
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
        console.log("category lists : ", categoryList)
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
          return;
        }

        querySnapshot.forEach((doc) => {
          const productData = doc.data() as productsType;
          setLatestItemLists(prev => [...prev, productData]);
          setAllProducts(prev => [...prev, productData]);
        });
        console.log("product lists : ", allProducts)
        setPreviousStart(querySnapshot.docs[(querySnapshot.docs.length - 1)-querySnapshot.docs.length]);
        setStartingDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      });
    } catch (error) {
      handleFirestoreError(error);
    } finally {
      setRefreshing(false);
      setIsProductsLoading(false);
    }
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
          collection(db, `${PRODUCTS_DATA}`),
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

    // Handle scroll events for animations
    const handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    );

    // Animate header and categories based on scroll
    useEffect(() => {
      const headerListener = scrollY.addListener(({ value }) => {
        // Animate header height (compact when scrolling up)
        const newHeaderHeight = Math.max(0.7, 1 - (value / 200));
        headerHeight.setValue(newHeaderHeight);
        
        // Animate category opacity (fade out images when scrolling up)
        const newOpacity = Math.max(0, 1 - (value / 100));
        categoryOpacity.setValue(newOpacity);
        
        // Animate category container height (shrink when scrolling up)
        const newCategoryHeight = Math.max(100, 126 - (value / 2));
        categoryContainerHeight.setValue(newCategoryHeight);
        
        // Animate marquee height (shrink when scrolling up)
        const newMarqueeHeight = Math.max(25, 40 - (value / 4));
        marqueeHeight.setValue(newMarqueeHeight);
        
        // Set compact mode based on scroll position
        setIsCompactMode(value > 50);
      });

      return () => scrollY.removeListener(headerListener);
    }, [scrollY, headerHeight, categoryOpacity, categoryContainerHeight, marqueeHeight]);
    
  
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

  if (isOffline) {
    return (
      <View style={styles.container}>
        <NavBar title="Furniture" showBack={false} showSearch={true} />
        <NetworkError onRetry={handleRetry} message={error || undefined} />
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
      
      {searchQuery ? (
        <>
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
          <Animated.View style={[
            styles.categoriesContainer,
            {
              height: categoryContainerHeight,
            }
          ]}>
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
                    index={index}
                    scrollOpacity={categoryOpacity}
                    containerHeight={categoryContainerHeight}
                    isCompact={isCompactMode}
                  />
                )} 
                keyExtractor={(item, index) => item.categoryId?.toString() || index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            }
          </Animated.View>

          {/* Marquee Text */}
          <Animated.View style={{
            height: marqueeHeight,
            overflow: 'hidden',
          }}>
            <MarqueeText 
              text="🔥 Special Offer: Get 20% off on all furniture this week! 🎉 Free shipping on orders above $500 💫"
              speed={30}
              backgroundColor="#FF6B6B"
              textColor="white"
              fontSize={14}
              height={marqueeHeight}
            />
          </Animated.View>

          {isProductsLoading ? 
            <ProductsSkeleton /> 
            :
            <Animated.FlatList     
              numColumns={2}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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
                  item={item}
                />
              )} 
              keyExtractor={(item, index) => item.productId?.toString() || index.toString()}
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
              showsVerticalScrollIndicator={false}
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
    marginBottom: 0,
    paddingHorizontal: 4,
    minHeight: 100,
  },
  scrollInnerContainer: {
    paddingBottom: 100,
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
});
