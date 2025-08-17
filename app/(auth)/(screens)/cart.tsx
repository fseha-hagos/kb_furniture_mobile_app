import ContactAdmin from '@/app/components/ContactAdmin';
import { LanguageCode } from '@/utils/i18n';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Dimensions,
    FlatList,
    Linking,
    Modal,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import CartCard from '../../components/cartCard';
import { useAuth } from '../../context/cartContext';
import { useBackHandler } from '../../hooks/useBackHandler';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        // backgroundColor: '#F5F5F5',
    },
    // Beautiful Navbar Styles
    navbarContainer: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    navbarGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 6,
        paddingTop: 6, // For status bar
        minHeight: 80,
    },
    navbarBackButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    backButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
    },
    navbarTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    titleIconContainer: {
        marginRight: 12,
    },
    titleIconGradient: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    titleTextContainer: {
        alignItems: 'center',
    },
    navbarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    navbarSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '400',
    },
    navbarActions: {
        flexDirection: 'row',
        gap: 8,
    },
    navbarActionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    actionButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    emptyText: {
        fontSize: 24,
        color: '#333333',
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: '600',
    },
    emptySubText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 32,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    shopNowButton: {
        width: '85%',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        
    },
    shopNowText: {
        fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
       
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: Platform.OS === 'ios' ? 35 : 25,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    button: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    priceContainer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    priceAndTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 8,
    },
    priceText: {
        fontSize: 16,
        color: "#666666",
    },
    divider: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        marginVertical: 16,
    },
    headerContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#666666',
    },
    cartItemContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00685C',
    },
    shippingText: {
        fontSize: 16,
        color: '#666666',
    },
    freeShipping: {
        color: '#4CAF50',
        fontWeight: '500',
    },
    priceLabel: {
        fontSize: 16,
        color: '#666666',
    },
    priceValue: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '600',
    },
    totalLabel: {
        fontSize: 18,
        color: '#333333',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 18,
        color: '#00685C',
        fontWeight: 'bold',
    },
    cartIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#00685C',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cartCount: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF5722',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    cartCountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666666',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F8F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    contactButtonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    contactAdminButton: {
        marginTop: 10,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

});

const Cart = () => {
    const router = useRouter();
    const { carts, totalPrice, deleteFromCart, updateQuantity } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showContactAdmin, setShowContactAdmin] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const primaryColor = useThemeColor({}, 'primary');
    const secondaryColor = useThemeColor({}, 'secondary');
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');

    const { i18n, t } = useTranslation();
    const currentLang: LanguageCode = i18n.language as LanguageCode;

    // Use the custom back handler hook
    useBackHandler({
        onBackPress: () => {
            // Handle any custom back logic here if needed
            return false; // Let the default back action happen
        },
        enabled: true
    });

    // Custom Beautiful Navbar for Cart Page
    const CartNavbar = () => (
        <View style={styles.navbarContainer}>
            <LinearGradient
                colors={[primaryColor, primaryColor]}
                style={styles.navbarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Back Button */}
                <TouchableOpacity 
                    style={styles.navbarBackButton}
                    onPress={() => router.back()}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                        style={styles.backButtonGradient}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Title Section */}
                <View style={styles.navbarTitleContainer}>
                    <View style={styles.titleIconContainer}>
                        <LinearGradient
                            colors={[primaryColor, primaryColor]}
                            style={styles.titleIconGradient}
                        >
                            <Ionicons name="cart" size={20} color={primaryColor} />
                        </LinearGradient>
                    </View>
                    <View style={styles.titleTextContainer}>
                        <Text style={styles.navbarTitle}>{t('shoppingCart')}</Text>
                        <Text style={styles.navbarSubtitle}>{carts?.length || 0} {t('items')}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.navbarActions}>
                    <TouchableOpacity 
                        style={styles.navbarActionButton}
                        onPress={() => router.push('/(auth)/(tabs)/home')}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                            style={styles.actionButtonGradient}
                        >
                            <Ionicons name="home" size={18} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.navbarActionButton}
                        onPress={() => router.push('/(auth)/(tabs)/search')}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                            style={styles.actionButtonGradient}
                        >
                            <Ionicons name="search" size={18} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();

        // Cleanup function to handle any potential back handlers
        return () => {
            try {
                // Stop any running animations
                fadeAnim.stopAnimation();
                scaleAnim.stopAnimation();
                slideAnim.stopAnimation();
                
                // Reset animation values
                fadeAnim.setValue(0);
                scaleAnim.setValue(0.9);
                slideAnim.setValue(50);
            } catch (error) {
                console.log('Animation cleanup error:', error);
            }
        };
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        // Fetch new data here (API call, etc.)
        // Update your component's state with the new data
        setRefreshing(false);
    };

    useEffect(() => {
        setShowAlert(false);
    }, []);

    const handleOnTelegram = async () => {
        const link = 'https://t.me/+251962588731/';
        Linking.openURL(link);
    };

    if (!carts || carts.length === 0) {
        return (
            <View style={styles.container}>
                {/* Beautiful Custom Navbar */}
                <CartNavbar />
                <Animated.View 
                    style={[
                        styles.emptyContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { scale: scaleAnim },
                                { translateY: slideAnim }
                            ]
                        }
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome name="shopping-cart" size={40} color={primaryColor} />
                    </View>
                    <Text style={styles.emptyText}>{t('cartEmptyTitle')}</Text>
                    <Text style={styles.emptySubText}>{t('cartEmptySubtext')}</Text>
                    <TouchableOpacity 
                        style={styles.shopNowButton}
                        onPress={() => router.push('/(auth)/(tabs)/home')}
                    >
                        
                        <LinearGradient
                            colors={[primaryColor, primaryColor]}
                            style={styles.gradientButton}
                        >
                            <Ionicons name="search" size={18} color="white" style={{ marginRight: 6 }} />
                            <Text style={styles.shopNowText}>{t('startShopping')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Beautiful Custom Navbar */}
            <CartNavbar />
         
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
            <FlatList 
                data={carts}
                renderItem={({ item, index }) => (
                    <Animated.View
                        style={[
                            styles.cartItemContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { scale: scaleAnim },
                                    { translateX: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-20, 0]
                                    })}
                                ]
                            }
                        ]}
                    >
                        <CartCard
                            item={item}
                            deleteFromCart={deleteFromCart}
                            updateQuantity={updateQuantity}
                        />
                    </Animated.View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                
            />
            </Animated.View>
       
            <Animated.View 
                style={[
                    styles.priceContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.priceAndTotal}>
                    <Text style={styles.priceLabel}>{t('subtotal')}</Text>
                    <Text style={styles.priceValue}>{t('birr')} {totalPrice}</Text>
                </View>
                <View style={styles.priceAndTotal}>
                    <Text style={styles.shippingText}>{t('shipping')}</Text>
                    <Text style={[styles.shippingText, styles.freeShipping]}>{t('free')}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.priceAndTotal}>
                    <Text style={styles.totalLabel}>{t('totalAmount')}</Text>
                    <Text style={styles.totalValue}>{t('birr')} {totalPrice}</Text>
                </View>
            </Animated.View>

            {/* Contact Admin Button */}
            <Animated.View 
                style={[
                    styles.contactButtonContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <TouchableOpacity 
                    style={styles.contactAdminButton}
                    onPress={() => setShowContactAdmin(true)}
                >
                    <LinearGradient
                        colors={[primaryColor, primaryColor]}
                        style={styles.gradientButton}
                    >
                        <Ionicons name="chatbubble-ellipses" size={20} color="white" />
                        <Text style={styles.contactButtonText}>{t('contactAdmin')}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
                      

            {/* Contact Admin Modal */}
            
            <Modal
                visible={showContactAdmin}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() => setShowContactAdmin(false)}
            >    
               <ContactAdmin onClose={() => setShowContactAdmin(false)} />
            </Modal>
        </View>
    );
};

export default Cart;
  