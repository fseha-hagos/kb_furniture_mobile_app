import { useThemeColor } from '@/hooks/useThemeColor';
import { productsType } from '@/types/type';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NavBar from '../../components/navbar';
import ProductComparison from '../../components/ProductComparison';
import ReviewSection from '../../components/ReviewSection';
import { useAuth } from '../../context/cartContext';
import { useProduct } from '../../context/productContext';

  const { width } = Dimensions.get('window');

  interface props {
    item : productsType
   }
  const ProductSkeleton = () => {
    return (
      <View style={styles.container}>
        <NavBar title="Product Details" showBack={true} showSearch={false}/>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollInnerContainer}
          showsVerticalScrollIndicator={false}>
          
          {/* Image Skeleton */}
          <SkeletonPlaceholder>
            <View style={styles.imageContainer} />
          </SkeletonPlaceholder>

          <View style={styles.contentContainer}>
            {/* Title and Price Skeleton */}
            <SkeletonPlaceholder>
              <View style={styles.headerSection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: '60%', height: 30, borderRadius: 4 }} />
                  <View style={{ width: '30%', height: 30, borderRadius: 4 }} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <View key={index} style={{ width: 20, height: 20, borderRadius: 10, marginRight: 4 }} />
                  ))}
                </View>
              </View>
            </SkeletonPlaceholder>

            {/* Delivery Info Skeleton */}
            <SkeletonPlaceholder>
              <View style={[styles.deliveryContainer, { height: 60 }]} />
            </SkeletonPlaceholder>

            {/* Color Selection Skeleton */}
            <SkeletonPlaceholder>
              <View style={{ marginBottom: 24 }}>
                <View style={{ width: 120, height: 24, borderRadius: 4, marginBottom: 12 }} />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {[1, 2, 3, 4].map((_, index) => (
                    <View key={index} style={{ width: 40, height: 40, borderRadius: 20 }} />
                  ))}
                </View>
              </View>
            </SkeletonPlaceholder>

            {/* Quantity Skeleton */}
            <SkeletonPlaceholder>
              <View style={{ marginBottom: 24 }}>
                <View style={{ width: 100, height: 24, borderRadius: 4, marginBottom: 12 }} />
                <View style={{ width: 120, height: 50, borderRadius: 8 }} />
              </View>
            </SkeletonPlaceholder>

            {/* Description Skeleton */}
            <SkeletonPlaceholder>
              <View style={{ marginBottom: 24 }}>
                <View style={{ width: 120, height: 24, borderRadius: 4, marginBottom: 12 }} />
                <View style={{ width: '100%', height: 80, borderRadius: 4 }} />
              </View>
            </SkeletonPlaceholder>
          </View>
        </ScrollView>

        {/* Add to Cart Button Skeleton */}
        <View style={styles.bottomContainer}>
          <SkeletonPlaceholder>
            <View style={{ width: '100%', height: 56, borderRadius: 12 }} />
          </SkeletonPlaceholder>
        </View>
      </View>
    );
  };

  const Product = () => {
    const router = useRouter();
    const {carts, onAddToCart, refreshCart, deleteFromCart} = useAuth();
    const { addToFavorites, removeFromFavorites, isFavorite, addToRecentlyViewed } = useProduct();
    const [color, setColor] = useState(null);
    const [total, setTotal] = useState(1);
    const [isOffline, setIsOffline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const params = useLocalSearchParams();
    const productData = JSON.parse(params.productData as string) as productsType;
    const [activeColorIndex, setActiveColorIndex] = React.useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

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
      let isMounted = true;
      const loadData = async () => {
        try {
          await addToRecentlyViewed(productData);
          if (isMounted) setIsLoading(false);
        } catch (error) {
          if (isMounted) {
            setIsOffline(true);
            setIsLoading(false);
          }
        }
      };
      loadData();
      return () => { isMounted = false; };
    },[]);

    const handleAddToCart = async (productData:productsType) => {
      try {
        const item = productData
        const selectedColor = productData.colors[activeColorIndex];
        await onAddToCart!(item, selectedColor);
        await refreshCart!();
        setTotal(1);
        router.push({
          pathname: "/cart",
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
        Alert.alert(
          'Connection Error',
          'Unable to add item to cart. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      }
    };
    
    const handleOnTotalPurchase = (t :number) => {
      if(t >= 1){
        setTotal(t);
      }
      refreshCart!();
    };

    const handleShare = async () => {
      try {
        await Share.share({
          message: `Check out this amazing ${productData.title} for only $${productData.price}!`,
          url: productData.images[0],
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    };

    const toggleFavorite = () => {
      if (isFavorite(productData.productId)) {
        removeFromFavorites(productData.productId);
      } else {
        addToFavorites(productData.productId);
      }
    };

    const handleScroll = (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffset / width);
      setCurrentImageIndex(index);
    };

    if (isLoading) {
      return <ProductSkeleton />;
    }
if(!productData) return;
    
       console.log("uri product: ",productData.images[0])
      return (
        <View style={styles.container}>
          <NavBar title="Product Details" showBack={true} showSearch={false}/>
          {isOffline && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>You're offline. Some features may be limited.</Text>
            </View>
          )}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollInnerContainer}
            showsVerticalScrollIndicator={false}>
            
            {/* Product Image Section */}
            <View style={styles.imageContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imageScrollView}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                {productData.images.map((image, index) => (
                  <Image 
                    key={`product-image-${index}`}
                    source={{ uri: image }} 
                    style={styles.image}
                    resizeMode="cover"
                    onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                  />
                ))}
              </ScrollView>
              <View style={styles.paginationContainer}>
                {productData.images.map((_, index) => (
                  <View
                    key={`pagination-dot-${index}`}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.favoriteButton]} 
                  onPress={toggleFavorite}>
                  <FontAwesome
                    name={isFavorite(productData.productId) ? "heart" : "heart-o"}
                    size={24}
                    color={isFavorite(productData.productId) ? "#FF0000" : primaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.shareButton]} 
                  onPress={handleShare}>
                  <FontAwesome name="share" size={24} color={primaryColor} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.fullScreenButton}
                onPress={() => setIsFullScreen(true)}>
                <FontAwesome name="expand" size={24} color={primaryColor} />
              </TouchableOpacity>
            </View>

            {/* Full Screen Image Modal */}
            <Modal
              visible={isFullScreen}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsFullScreen(false)}>
              <View style={styles.fullScreenContainer}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setIsFullScreen(false)}>
                  <FontAwesome name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.fullScreenScrollView}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}>
                  {productData.images.map((image, index) => (
                    <Image 
                      key={`product-image2-${index}`}
                      source={{ uri: image }} 
                      style={styles.fullScreenImage}
                      resizeMode="contain"
                      onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                    />
                  ))}
                </ScrollView>
                <View style={styles.fullScreenPaginationContainer}>
                  {productData.images.map((_, index) => (
                    <View
                      key={`pagination-dot2-${index}`}
                      style={[
                        styles.fullScreenPaginationDot,
                        index === currentImageIndex && styles.fullScreenPaginationDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </Modal>

            {/* Product Info Section */}
            <View style={styles.contentContainer}>
              <View style={styles.headerSection}>
                <View style={styles.titleSection}>
                  <Text style={styles.productName}>{productData.title}</Text>
                  <Text style={styles.productPrice}>${productData.price}</Text>
                </View>
                {/* <View style={styles.ratingContainer}>
                  {Array.from({ length: productData.rating }).map((_, index) => (
                    <FontAwesome
                      name="star"
                      size={20}
                      color="#FFD700"
                      style={styles.starIcon}
                      key={index}
                    />
                  ))}
                  <Text style={styles.ratingText}>{productData.rating}</Text>
                </View> */}
              </View>

              {/* Delivery Info */}
              <View style={styles.deliveryContainer}>
                <View style={styles.deliveryItem}>
                  <Ionicons name="location-outline" size={24} color="#00685C" />
                  <Text style={styles.deliveryText}>Mekelle</Text>
                </View>
                <View style={styles.deliveryItem}>
                  <Ionicons name="car-outline" size={24} color="#00685C" />
                  <Text style={styles.deliveryText}>Free Delivery</Text>
                </View>
              </View>

              {/* Color Selection */}
              <View style={styles.colorSection}>
                <Text style={styles.sectionTitle}>Available Colors</Text>
                <View style={styles.colorsRow}>
                  {productData.colors.map((color: string, i: number) => (
                    <TouchableOpacity
                      key={`color-${color}`}
                      onPress={() => setActiveColorIndex(i)}
                      style={[
                        styles.colorContainer,
                        activeColorIndex === i && styles.activeColorContainer,
                      ]}>
                      <View style={[styles.colorDot, { backgroundColor: color }]} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quantity Selection */}
              {/* <View style={styles.quantitySection}>
                <Text style={styles.sectionTitle}>Quantity</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleOnTotalPurchase(Number(total)-1)}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{total}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleOnTotalPurchase(Number(total)+1)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{productData.description}</Text>
              </View>

              {/* Product Comparison */}
              <ProductComparison currentProduct={productData} />

              {/* Reviews Section */}
              <ReviewSection productId={productData.productId} />
            </View>
          </ScrollView>

          {/* Add to Cart Button */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={[styles.addToCartButton,{backgroundColor: primaryColor} ]}
              onPress={() => handleAddToCart(productData)}
              >
              <Image
                source={require('@/assets/images/shopping-bag.png')}
                style={styles.shoppingBagIcon}
                resizeMode="contain"
              />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
   
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
      flex: 1,
    },
    scrollInnerContainer: {
      paddingBottom: 100,
    },
    imageContainer: {
      position: 'relative',
      width: width,
      height: width * 0.8,
    },
    imageScrollView: {
      width: '100%',
      height: '100%',
    },
    image: {
      width: width,
      height: width * 0.8,
    },
    actionButtonsContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      flexDirection: 'column',
      gap: 12,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    favoriteButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    shareButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    contentContainer: {
      paddingHorizontal: 15,
      paddingVertical: 5
    },
    headerSection: {
      marginBottom: 5,
    },
    titleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    productName: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1A1A1A',
      flex: 1,
      marginRight: 16,
    },
    productPrice: {
      fontSize: 24,
      fontWeight: '700',
      color: '#00685C',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    starIcon: {
      marginRight: 4,
    },
    ratingText: {
      marginLeft: 8,
      fontSize: 16,
      color: '#666666',
    },
    deliveryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#F8F0F8',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 6,
      marginBottom: 10,
    },
    deliveryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    deliveryText: {
      fontSize: 16,
      color: '#333333',
    },
    colorSection: {
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 12,
    },
    colorsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    colorContainer: {
      padding: 3,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    activeColorContainer: {
      borderColor: '#00685C',
    },
    colorDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    quantitySection: {
      marginBottom: 24,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8F8F8',
      borderRadius: 12,
      padding: 8,
      alignSelf: 'flex-start',
    },
    quantityButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
    },
    quantityButtonText: {
      fontSize: 20,
      fontWeight: '600',
      color: '#00685C',
    },
    quantityText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
      marginHorizontal: 16,
      minWidth: 30,
      textAlign: 'center',
    },
    descriptionSection: {
      marginBottom: 24,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: '#666666',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
    },
    addToCartButton: {
      
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 12,
    },
    shoppingBagIcon: {
      width: 24,
      height: 24,
      tintColor: '#FFFFFF',
    },
    addToCartText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    offlineBanner: {
      backgroundColor: '#FFA500',
      padding: 10,
      alignItems: 'center',
    },
    offlineText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    paginationContainer: {
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
      backgroundColor: '#FFFFFF',
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    fullScreenButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    fullScreenContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullScreenScrollView: {
      width: '100%',
      height: '100%',
    },
    fullScreenImage: {
      width: width,
      height: '100%',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 1,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullScreenPaginationContainer: {
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    fullScreenPaginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    fullScreenPaginationDotActive: {
      backgroundColor: '#FFFFFF',
      width: 12,
      height: 12,
      borderRadius: 6,
    },
  });

  export default Product;
  