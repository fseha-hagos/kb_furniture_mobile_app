import { db } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { productsType } from '@/types/type';
import { LanguageCode } from '@/utils/i18n';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProduct } from '../context/productContext';

interface ProductComparisonProps {
  currentProduct: productsType;
}

interface Feature {
  name: string;
  current: string;
  compare: string;
  icon: 'dollar' | 'star' | 'paint-brush' | 'file-text' | 'comments';
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

const { width } = Dimensions.get('window');

const ProductComparison: React.FC<ProductComparisonProps> = ({ currentProduct }) => {

  // const tempLanguage = "en";
  const { i18n, t } = useTranslation();
  const currentLang: LanguageCode = i18n.language as LanguageCode;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<productsType | null>(null);
  const [currentProductReviews, setCurrentProductReviews] = useState<Review[]>([]);
  const [selectedProductReviews, setSelectedProductReviews] = useState<Review[]>([]);
  const { recentlyViewed } = useProduct();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'tint');
  const subtextColor = useThemeColor({}, 'icon'); // Use icon color for subtext
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault');
  const tabIconSelectedColor = useThemeColor({}, 'tabIconSelected');
  const border = useThemeColor({}, 'border');


  const fetchReviews = async (productId: string) => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, where('productId', '==', productId));
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  };

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 'N/A';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleProductSelect = async (product: productsType) => {
    if (product.productId !== currentProduct.productId) {
      setSelectedProduct(product);
      // Fetch reviews for both products
      const [currentReviews, selectedReviews] = await Promise.all([
        fetchReviews(currentProduct.productId),
        fetchReviews(product.productId)
      ]);
      setCurrentProductReviews(currentReviews);
      setSelectedProductReviews(selectedReviews);
      setModalVisible(true);
    }
  };

  const handleViewProduct = (product: productsType) => {
    setModalVisible(false);
    router.push({
      pathname: "/product",
      params: { productData: JSON.stringify(product) }
    });
  };

  const renderComparisonTable = () => {
    if (!selectedProduct) return null;

    const features: Feature[] = [
      { 
        name: t('price'), 
        current: `${t('birr')} ${currentProduct.price?.toString() || 'N/A'}`, 
        compare: `${t('birr')} ${selectedProduct.price?.toString() || 'N/A'}`,
        icon: 'dollar'
      },
      { 
        name: t('rating'), 
        current: calculateAverageRating(currentProductReviews), 
        compare: calculateAverageRating(selectedProductReviews),
        icon: 'star'
      },
      { 
        name: t('reviews'),  
        current: `${currentProductReviews.length} reviews`, 
        compare: `${selectedProductReviews.length} reviews`,
        icon: 'comments'
      },
      { 
        name: t('colors'),  
        current: (currentProduct.colors || []).join(', ') || 'N/A', 
        compare: (selectedProduct.colors || []).join(', ') || 'N/A',
        icon: 'paint-brush'
      },
      { 
        name: t('description'),  
        current: currentProduct.description[currentLang] || 'N/A', 
        compare: selectedProduct.description[currentLang] || 'N/A',
        icon: 'file-text'
      },
    ];

    return (
      <View style={styles.comparisonTable}>
        <View style={styles.tableHeader}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>{t('features')}</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>{t('current')}</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>{t('compare')}</Text>
          </View>
        </View>
        {features.map((feature, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.cell}>
              <FontAwesome name={feature.icon} size={16} color={primaryColor} style={styles.featureIcon} />
              <Text style={styles.featureName}>{feature.name}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.featureValue}>{feature.current}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.featureValue}>{feature.compare}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[{backgroundColor: primaryColor}, styles.compareButton]}
        onPress={() => setModalVisible(true)}>
        <FontAwesome name="balance-scale" size={20} color="white" />
        <Text style={styles.compareButtonText}>{t('compareProducts')}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedProduct(null);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('compareProducts')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedProduct(null);
                }}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {!selectedProduct ? (
                <>
                  <Text style={styles.sectionTitle}>{t('selectProductToCompare')}</Text>
                  <View style={styles.productGrid}>
                    {recentlyViewed && recentlyViewed.length > 0 ? (
                      recentlyViewed
                        .filter((product) => product.productId !== currentProduct.productId)
                        .map((product, index) => {
                          return (
                            <TouchableOpacity
                              key={index.toString()}
                              style={styles.productCard}
                              onPress={() => handleProductSelect(product)}>
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  source={{ uri: product.images[0] }}
                                  style={styles.productImage}
                                  resizeMode="cover"
                                  onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                                />
                              ) : (
                                <View style={[styles.productImage, { backgroundColor: '#f0f0f0' }]}>
                                  <Text>{t('noImageAvailable')}</Text>
                                </View>
                              )}
                              <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={1}>
                                  {product.name[currentLang]}
                                </Text>
                                <Text style={styles.productPrice}>{t('birr')} {product.price}</Text>
                                <View style={styles.stockInfo}>
                                  <Text style={styles.stockText}>{t('stock')}: {product.stock}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        })
                    ) : (
                      <Text style={styles.noProductsText}>{t('noRecentlyViewed')}</Text>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.productsContainer}>
                    <View style={styles.productCard}>
                      <Image
                        source={{ uri: currentProduct.images[0] }}
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{currentProduct.name[currentLang]}</Text>
                        <Text style={styles.productPrice}>{t('birr')} {currentProduct.price}</Text>
                        <View style={styles.stockInfo}>
                          <Text style={styles.stockText}>{t('stock')}: {currentProduct.stock}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.productCard}>
                      <Image
                        source={{ uri: selectedProduct.images[0] }}
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{selectedProduct.name[currentLang]}</Text>
                        <Text style={styles.productPrice}>{t('birr')} {selectedProduct.price}</Text>
                        <View style={styles.stockInfo}>
                          <Text style={styles.stockText}>{t('stock')}: {selectedProduct.stock}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {renderComparisonTable()}

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      key="current-product"
                      style={[styles.actionButton, styles.viewButton, {backgroundColor: primaryColor}]}
                      onPress={() => handleViewProduct(currentProduct)}>
                      <Text style={styles.buttonText}>{t('viewCurrent')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      key="compare-product"
                      style={[styles.actionButton, styles.viewButton, {backgroundColor: primaryColor}]}
                      onPress={() => handleViewProduct(selectedProduct)}>
                      <Text style={styles.buttonText}>{t('viewCompare')}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
  },
  modalScroll: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  productsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedProductCard: {
    borderColor: '#00685C',
    borderWidth: 2,
    backgroundColor: '#F8F8F8',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  productInfo: {
    width: '100%',
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
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    color: '#666666',
  },
  comparisonTable: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1A1A1A',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 16,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  featureIcon: {
    marginRight: 4,
  },
  featureName: {
    fontWeight: '500',
    color: '#1A1A1A',
  },
  featureValue: {
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
   
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButton: {
    backgroundColor: '#00685C',
    marginBottom: 25
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  noProductsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProductComparison; 