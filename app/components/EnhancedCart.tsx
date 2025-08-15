import { cartType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAuth } from '../context/cartContext';

interface SuggestedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface EnhancedCartProps {
  suggestedProducts: SuggestedProduct[];
}

const EnhancedCart: React.FC<EnhancedCartProps> = ({ suggestedProducts }) => {

  const tempLanguage = "en"

  const router = useRouter();
  const { carts, totalPrice, deleteFromCart } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');

  const shippingCost = (totalPrice || 0) > 500 ? 0 : 25;
  const tax = (totalPrice || 0) * 0.08; // 8% tax
  const finalTotal = (totalPrice || 0) + shippingCost + tax;

  const handleQuantityChange = (item: cartType, newQuantity: number) => {
    if (newQuantity < 1) {
      Alert.alert('Remove Item', 'Do you want to remove this item from cart?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => deleteFromCart?.(item.product) }
      ]);
    } else {
      // Update quantity logic would go here
      console.log('Update quantity to:', newQuantity);
    }
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }
    
    setIsApplyingPromo(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode.toLowerCase() === 'save10') {
        Alert.alert('Success', '10% discount applied!');
      } else {
        Alert.alert('Error', 'Invalid promo code');
      }
    }, 1000);
  };

  const proceedToCheckout = () => {
    if (carts && carts.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }
    router.push('/(auth)/(screens)/product');
  };

  const SuggestedProductCard = ({ product }: { product: SuggestedProduct }) => (
    <TouchableOpacity 
      style={styles.suggestedProductCard}
      onPress={() => router.push('/(auth)/(screens)/product')}
    >
      <View style={styles.suggestedProductImage}>
        <Ionicons name="image-outline" size={30} color="#ccc" />
      </View>
      <Text style={styles.suggestedProductName}>{product.name}</Text>
      <Text style={styles.suggestedProductPrice}>Birr {product.price}</Text>
      <TouchableOpacity style={styles.addToCartButton}>
        <Ionicons name="add" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartSection}>
          <Text style={styles.sectionTitle}>Shopping Cart ({carts?.length || 0} items)</Text>
          
          {carts && carts.length > 0 ? (
            carts.map((item: cartType, index: number) => (
              <View key={index} style={styles.cartItem}>
                <View style={styles.itemImage}>
                  <Ionicons name="image-outline" size={40} color="#ccc" />
                </View>
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.product.name[tempLanguage]}</Text>
                  <Text style={styles.itemColor}>Color: {item.selectedColor || 'Default'}</Text>
                  <Text style={styles.itemPrice}>Birr {item.product.price}</Text>
                </View>
                
                <View style={styles.itemActions}>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                    >
                      <Ionicons name="remove" size={16} color={primaryColor} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                    >
                      <Ionicons name="add" size={16} color={primaryColor} />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => deleteFromCart?.(item.product)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={60} color="#ccc" />
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
              <TouchableOpacity 
                style={styles.shopNowButton}
                onPress={() => router.push('/(auth)/(tabs)/home')}
              >
                <Text style={styles.shopNowText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Promo Code Section */}
        <View style={styles.promoSection}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity 
              style={[styles.applyButton, isApplyingPromo && styles.applyButtonDisabled]}
              onPress={applyPromoCode}
              disabled={isApplyingPromo}
            >
              <Text style={styles.applyButtonText}>
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Birr {(totalPrice || 0).toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {shippingCost === 0 ? 'Free' : `Birr ${shippingCost.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>Birr {tax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Birr {finalTotal.toFixed(2)}</Text>
          </View>
          
          {shippingCost > 0 && (
                          <Text style={styles.freeShippingText}>
                Add Birr {(500 - (totalPrice || 0)).toFixed(2)} more for free shipping
              </Text>
          )}
        </View>

        {/* Smart Suggestions */}
        {suggestedProducts.length > 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>You might also like</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedProducts.map((product, index) => (
                <SuggestedProductCard key={index} product={product} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {carts && carts.length > 0 && (
        <View style={styles.checkoutContainer}>
          <TouchableOpacity 
            style={[styles.checkoutButton, { backgroundColor: primaryColor }]} 
            onPress={proceedToCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutTotal}>Birr {finalTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.continueShoppingButton, { borderColor: primaryColor }]} 
        onPress={() => router.push('/(auth)/(tabs)/home')}
      >
        <Text style={[styles.continueShoppingText, { color: primaryColor }]}>
          Continue Shopping
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  cartSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemColor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00685C',
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 15,
  },
  removeButton: {
    padding: 5,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: '#00685C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  promoSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: '#00685C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  summarySection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00685C',
  },
  freeShippingText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
  suggestionsSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  suggestedProductCard: {
    width: 120,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    position: 'relative',
  },
  suggestedProductImage: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  suggestedProductName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  suggestedProductPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00685C',
  },
  addToCartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00685C',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    backgroundColor: '#00685C',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkoutTotal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  continueShoppingButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00685C',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EnhancedCart; 