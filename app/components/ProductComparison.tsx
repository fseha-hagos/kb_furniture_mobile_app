import { db } from '@/firebaseConfig';
import { productsType } from '@/types/type';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<productsType | null>(null);
  const [currentProductReviews, setCurrentProductReviews] = useState<Review[]>([]);
  const [selectedProductReviews, setSelectedProductReviews] = useState<Review[]>([]);
  const { recentlyViewed } = useProduct();
  const router = useRouter();

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
        name: 'Price', 
        current: `$${currentProduct.price?.toString() || 'N/A'}`, 
        compare: `$${selectedProduct.price?.toString() || 'N/A'}`,
        icon: 'dollar'
      },
      { 
        name: 'Rating', 
        current: calculateAverageRating(currentProductReviews), 
        compare: calculateAverageRating(selectedProductReviews),
        icon: 'star'
      },
      { 
        name: 'Reviews', 
        current: `${currentProductReviews.length} reviews`, 
        compare: `${selectedProductReviews.length} reviews`,
        icon: 'comments'
      },
      { 
        name: 'Colors', 
        current: (currentProduct.colors || []).join(', ') || 'N/A', 
        compare: (selectedProduct.colors || []).join(', ') || 'N/A',
        icon: 'paint-brush'
      },
      { 
        name: 'Description', 
        current: currentProduct.description || 'N/A', 
        compare: selectedProduct.description || 'N/A',
        icon: 'file-text'
      },
    ];

    return (
      <View style={styles.comparisonTable}>
        <View style={styles.tableHeader}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Features</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Current</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Compare</Text>
          </View>
        </View>
        {features.map((feature, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.cell}>
              <FontAwesome name={feature.icon} size={16} color="#00685C" style={styles.featureIcon} />
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
        style={styles.compareButton}
        onPress={() => setModalVisible(true)}>
        <FontAwesome name="balance-scale" size={20} color="white" />
        <Text style={styles.compareButtonText}>Compare Products</Text>
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
              <Text style={styles.modalTitle}>Compare Products</Text>
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
                  <Text style={styles.sectionTitle}>Select a product to compare:</Text>
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
                                  <Text>No image available</Text>
                                </View>
                              )}
                              <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={1}>
                                  {product.title}
                                </Text>
                                <Text style={styles.productPrice}>${product.price}</Text>
                                <View style={styles.stockInfo}>
                                  <Text style={styles.stockText}>Stock: {product.stock}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        })
                    ) : (
                      <Text style={styles.noProductsText}>No recently viewed products to compare</Text>
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
                        <Text style={styles.productName}>{currentProduct.title}</Text>
                        <Text style={styles.productPrice}>${currentProduct.price}</Text>
                        <View style={styles.stockInfo}>
                          <Text style={styles.stockText}>Stock: {currentProduct.stock}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.productCard}>
                      <Image
                        source={{ uri: selectedProduct.images[0] }}
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{selectedProduct.title}</Text>
                        <Text style={styles.productPrice}>${selectedProduct.price}</Text>
                        <View style={styles.stockInfo}>
                          <Text style={styles.stockText}>Stock: {selectedProduct.stock}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {renderComparisonTable()}

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      key="current-product"
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() => handleViewProduct(currentProduct)}>
                      <Text style={styles.buttonText}>View Current</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      key="compare-product"
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() => handleViewProduct(selectedProduct)}>
                      <Text style={styles.buttonText}>View Compare</Text>
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
    backgroundColor: '#00685C',
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
    backgroundColor: '#00685C',
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