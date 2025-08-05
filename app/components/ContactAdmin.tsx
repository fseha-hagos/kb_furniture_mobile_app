import { useThemeColor } from '@/hooks/useThemeColor';
import { cartType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/cartContext';

interface ContactAdminProps {
  onClose?: () => void;
}

const ContactAdmin: React.FC<ContactAdminProps> = ({ onClose }) => {
  const { carts, totalPrice } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'tint');
  const subtextColor = useThemeColor({}, 'icon'); // Use icon color for subtext
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault');
  const tabIconSelectedColor = useThemeColor({}, 'tabIconSelected');
  const border = useThemeColor({}, 'border');

  const formatCartItems = (): string => {
    if (!carts || carts.length === 0) return 'No items in cart';
    
    return carts.map((item: cartType) => {
      const quantity = item.quantity || 1;
      const color = item.selectedColor ? ` (${item.selectedColor})` : '';
      return `• ${item.product.title}${color} - Qty: ${quantity} - Birr ${item.product.price * quantity}`;
    }).join('\n');
  };

  const handleWhatsApp = async () => {
    if (!carts || carts.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }

    setIsLoading(true);
    const message = `Hello! I'm interested in purchasing the following items:

    ${formatCartItems()}

    Total: Birr ${totalPrice}

    Please contact me for more details.`;

    const whatsappUrl = `whatsapp://send?phone=+251985596125&text=${encodeURIComponent(message)}`;
    
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed on your device');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = async () => {
    const phoneNumber = '+251985596125';
    const phoneUrl = `tel:${phoneNumber}`;
    
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Phone app is not available');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not make phone call');
    }
  };

  const handleEmail = async () => {
    const subject = 'Cart Inquiry - KB Furniture';
    const body = `Hello,

I'm interested in purchasing the following items:

${formatCartItems()}

Total: Birr ${totalPrice}

Please contact me for more details.

Thank you!`;

    const emailUrl = `mailto:admin@kbfurniture.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Error', 'Email app is not available');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open email app');
    }
  };

  return (
    <View style={styles.container}>
      {/* Professional Header */}
      <View style={[{ backgroundColor: secondaryColor,},styles.header]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="business" size={24} color="white" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Contact Admin</Text>
              <Text style={styles.subtitle}>Get in touch with our team</Text>
            </View>
          </View>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart-outline" size={20} color={primaryColor} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.cartSummary}>
            <Text style={styles.cartText}>{formatCartItems()}</Text>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={[{color: primaryColor,},styles.totalText]}>Birr {totalPrice}</Text>
            </View>
          </View>
        </View>

        {/* Contact Options Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={20} color={primaryColor} />
            <Text style={styles.sectionTitle}>Contact Options</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.contactButton, styles.whatsappButton]} 
            onPress={handleWhatsApp}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="logo-whatsapp" size={24} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>
                  {isLoading ? 'Opening...' : 'WhatsApp'}
                </Text>
                <Text style={styles.buttonSubtext}>Quick chat with admin</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactButton, styles.callButton]} 
            onPress={handleCall}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="call" size={24} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Phone Call</Text>
                <Text style={styles.buttonSubtext}>Direct conversation</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactButton, styles.emailButton]} 
            onPress={handleEmail}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="mail" size={24} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Email</Text>
                <Text style={styles.buttonSubtext}>Detailed inquiry</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={secondaryColor} />
            <Text style={styles.infoText}>
              Our admin team will review your order and contact you within 24 hours to discuss payment and delivery options.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    width: '100%',
    height: '100%',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  cartSummary: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  contactButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  callButton: {
    backgroundColor: '#007AFF',
  },
  emailButton: {
    backgroundColor: '#FF9500',
  },
  infoSection: {
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
});

export default ContactAdmin; 