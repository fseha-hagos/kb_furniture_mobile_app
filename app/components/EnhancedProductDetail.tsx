import { productsType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/cartContext';

interface ProductSpec {
  label: string;
  value: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface EnhancedProductDetailProps {
  product: productsType & {
    specifications?: ProductSpec[];
    dimensions?: string;
    material?: string;
    warranty?: string;
    inStock?: boolean;
    rating?: number;
    reviewCount?: number;
  };
  relatedProducts: RelatedProduct[];
}

const EnhancedProductDetail: React.FC<EnhancedProductDetailProps> = ({ 
  product, 
  relatedProducts 
}) => {
  const router = useRouter();
  const { onAddToCart, handleLiked, likedProducts } = useAuth();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const isLiked = likedProducts?.some(item => item.productId === product.productId);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      Alert.alert('Out of Stock', 'This item is currently out of stock.');
      return;
    }
    
    onAddToCart?.(product, selectedColor);
    Alert.alert('Success', 'Item added to cart!');
  };

  const handleLike = () => {
    handleLiked?.(product);
  };

  const RelatedProductCard = ({ relatedProduct }: { relatedProduct: RelatedProduct }) => (
    <TouchableOpacity 
      style={styles.relatedProductCard}
      onPress={() => router.push('/(auth)/(screens)/product')}
    >
      <View style={styles.relatedProductImage}>
        <Ionicons name="image-outline" size={30} color="#ccc" />
      </View>
      <Text style={styles.relatedProductName}>{relatedProduct.name}</Text>
      <Text style={styles.relatedProductPrice}>${relatedProduct.price}</Text>
    </TouchableOpacity>
  );

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#FFD700" : "#ccc"}
        />
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Images */}
      <View style={styles.imageSection}>
        <View style={styles.mainImage}>
          <Ionicons name="image-outline" size={80} color="#ccc" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageThumbnails}>
          {product.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.thumbnail, selectedImage === index && styles.selectedThumbnail]}
              onPress={() => setSelectedImage(index)}
            >
              <Ionicons name="image-outline" size={30} color="#ccc" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Info */}
      <View style={styles.productInfoSection}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.title}</Text>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? "#E91E63" : "#666"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${product.price}</Text>
          {product.stock <= 0 && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {renderStars(product.rating)}
          </View>
          <Text style={styles.reviewCount}>({product.reviewCount || 0} reviews)</Text>
        </View>

        <Text style={styles.productDescription}>{product.description}</Text>
      </View>

      {/* Color Selection */}
      <View style={styles.colorSection}>
        <Text style={styles.sectionTitle}>Color</Text>
        <View style={styles.colorOptions}>
          {product.colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                selectedColor === color && styles.selectedColor
              ]}
              onPress={() => setSelectedColor(color)}
            >
              <Text style={styles.colorText}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Product Details Tabs */}
      <View style={styles.tabsSection}>
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'description' && styles.activeTab]}
            onPress={() => setActiveTab('description')}
          >
            <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
              Description
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'specifications' && styles.activeTab]}
            onPress={() => setActiveTab('specifications')}
          >
            <Text style={[styles.tabText, activeTab === 'specifications' && styles.activeTabText]}>
              Specifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'description' && (
            <View>
              <Text style={styles.descriptionText}>{product.description}</Text>
              <View style={styles.keyFeatures}>
                <Text style={styles.keyFeaturesTitle}>Key Features:</Text>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Premium quality materials</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Easy assembly</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>1-year warranty</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'specifications' && (
            <View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Material:</Text>
                <Text style={styles.specValue}>{product.material || 'Premium wood'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Dimensions:</Text>
                <Text style={styles.specValue}>{product.dimensions || 'Standard size'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Warranty:</Text>
                <Text style={styles.specValue}>{product.warranty || '1 year'}</Text>
              </View>
              {product.specifications?.map((spec, index) => (
                <View key={index} style={styles.specItem}>
                  <Text style={styles.specLabel}>{spec.label}:</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View>
              <View style={styles.reviewSummary}>
                <Text style={styles.reviewSummaryText}>
                  {product.rating || 0} out of 5 stars
                </Text>
                <Text style={styles.reviewCountText}>
                  Based on {product.reviewCount || 0} reviews
                </Text>
              </View>
              <TouchableOpacity style={styles.writeReviewButton}>
                <Ionicons name="create-outline" size={20} color="#00685C" />
                <Text style={styles.writeReviewText}>Write a Review</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>You might also like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts.map((relatedProduct, index) => (
              <RelatedProductCard key={index} relatedProduct={relatedProduct} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={[styles.addToCartButton, product.stock <= 0 && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.addToCartText}>
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  imageSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  imageThumbnails: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: '#00685C',
  },
  productInfoSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00685C',
    marginRight: 10,
  },
  outOfStockBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  colorSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedColor: {
    borderColor: '#00685C',
    backgroundColor: '#00685C',
  },
  colorText: {
    fontSize: 14,
    color: '#333',
  },
  tabsSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00685C',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#00685C',
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  keyFeatures: {
    marginTop: 15,
  },
  keyFeaturesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: '#333',
  },
  reviewSummary: {
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewSummaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  reviewCountText: {
    fontSize: 14,
    color: '#666',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#00685C',
    borderRadius: 8,
  },
  writeReviewText: {
    fontSize: 16,
    color: '#00685C',
    marginLeft: 8,
  },
  relatedSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  relatedProductCard: {
    width: 150,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
  },
  relatedProductImage: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  relatedProductPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00685C',
  },
  actionSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#00685C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default EnhancedProductDetail; 