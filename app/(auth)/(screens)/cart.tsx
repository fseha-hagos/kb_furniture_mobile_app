import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Linking,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import CartCard from '../../components/cartCard';
import NavBar from '../../components/navbar';
import { useAuth } from '../../context/cartContext';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
        padding: 18,
        alignItems: 'center',
        borderRadius: 16,
    },
    shopNowText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
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
        fontWeight: '500',
    },
    priceValue: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    totalLabel: {
        fontSize: 18,
        color: '#333333',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00685C',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cartIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00685C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartCount: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF4444',
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
        marginBottom: 16,
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 15,
        color: '#666666',
        fontWeight: '500',
    }
});

const Cart = () => {
    const router = useRouter();
    const { carts, totalPrice, deleteFromCart } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
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
                <NavBar title="My Cart" showBack={true} showSearch={false} />
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
                        <FontAwesome name="shopping-cart" size={40} color="#00685C" />
                    </View>
                    <Text style={styles.emptyText}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubText}>Looks like you haven't added anything to your cart yet. Start shopping to add items to your cart.</Text>
                    <TouchableOpacity 
                        style={styles.shopNowButton}
                        onPress={() => router.push('/(auth)/(tabs)/home')}
                    >
                        <LinearGradient
                            colors={['#00685C', '#00897B']}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.shopNowText}>Start Shopping</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <NavBar title="Shopping Cart" showBack={true} showSearch={false} />
         
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Shopping Cart</Text>
                        <Text style={styles.headerSubtitle}>{carts.length} items in your cart</Text>
                    </View>
                    <View style={styles.cartIcon}>
                        <MaterialCommunityIcons name="cart-outline" size={24} color="#FFFFFF" />
                        <View style={styles.cartCount}>
                            <Text style={styles.cartCountText}>{carts.length}</Text>
                        </View>
                    </View>
                </View> */}
                {/* <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Cart Items</Text>
                    <Text style={styles.sectionSubtitle}>{carts.length} items in your cart</Text>
                </View> */}

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
                            />
                        </Animated.View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListFooterComponent={
                        <>
                        
                            {/* <Animated.View 
                                style={[
                                    styles.priceContainer,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ scale: scaleAnim }]
                                    }
                                ]}
                            >
                                <View style={styles.priceAndTotal}>
                                    <Text style={styles.priceLabel}>Subtotal</Text>
                                    <Text style={styles.priceValue}>Birr {totalPrice}</Text>
                                </View>
                                <View style={styles.priceAndTotal}>
                                    <Text style={styles.shippingText}>Shipping</Text>
                                    <Text style={[styles.shippingText, styles.freeShipping]}>Free</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.priceAndTotal}>
                                    <Text style={styles.totalLabel}>Total Amount</Text>
                                    <Text style={styles.totalValue}>Birr {totalPrice}</Text>
                                </View>
                            </Animated.View> */}
                        </>
                    }
                />
                {/* <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => setShowAlert(true)}
                    >
                        <LinearGradient
                            colors={['#00685C', '#00897B']}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Get Coupon</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => { Linking.openURL('tel:+251948491265'); }}
                    >
                        <LinearGradient
                            colors={['#00685C', '#00897B']}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Call Us</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View> */}
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
                                    <Text style={styles.priceLabel}>Subtotal</Text>
                                    <Text style={styles.priceValue}>Birr {totalPrice}</Text>
                                </View>
                                <View style={styles.priceAndTotal}>
                                    <Text style={styles.shippingText}>Shipping</Text>
                                    <Text style={[styles.shippingText, styles.freeShipping]}>Free</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.priceAndTotal}>
                                    <Text style={styles.totalLabel}>Total Amount</Text>
                                    <Text style={styles.totalValue}>Birr {totalPrice}</Text>
                                </View>
                            </Animated.View>
                      

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="CN: 20000"
                message="20000 is your coupon number. Meet us with this coupon on Telegram or pay with our payment system methods!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Telegram"
                confirmText="Payment"
                cancelButtonColor='#00685C'
                confirmButtonColor="#00685C"
                onDismiss={() => {
                    setShowAlert(false);
                }}
                onCancelPressed={() => {
                    handleOnTelegram();
                }}
                onConfirmPressed={() => {
                    setShowAlert(false);
                }}
                titleStyle={{ color: "black", fontSize: 20, fontWeight: '600' }}
                messageStyle={{ color: "#666666", fontSize: 16 }}
            />
        </View>
    );
};

export default Cart;
  