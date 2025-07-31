//import liraries
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Navbar from '../../components/navbar';

interface Coupon {
    id: string;
    code: string;
    title: string;
    description: string;
    discount: string;
    minPurchase: number;
    validUntil: string;
    isActive: boolean;
    category: 'all' | 'furniture' | 'decor' | 'lighting';
}

// create a component
const Cupens = () => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'furniture' | 'decor' | 'lighting'>('all');
    const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);

    const categories = [
        { id: 'all', name: 'All Offers', icon: 'pricetag-outline' },
        { id: 'furniture', name: 'Furniture', icon: 'bed-outline' },
        { id: 'decor', name: 'Decor', icon: 'flower-outline' },
        { id: 'lighting', name: 'Lighting', icon: 'bulb-outline' },
    ];

    const coupons: Coupon[] = [
        {
            id: '1',
            code: 'WELCOME20',
            title: 'Welcome Discount',
            description: 'Get 20% off on your first order',
            discount: '20% OFF',
            minPurchase: 100,
            validUntil: '2024-12-31',
            isActive: true,
            category: 'all'
        },
        {
            id: '2',
            code: 'SOFA15',
            title: 'Sofa Special',
            description: '15% off on all sofa collections',
            discount: '15% OFF',
            minPurchase: 500,
            validUntil: '2024-06-30',
            isActive: true,
            category: 'furniture'
        },
        {
            id: '3',
            code: 'FREESHIP',
            title: 'Free Shipping',
            description: 'Free shipping on orders over $300',
            discount: 'FREE SHIPPING',
            minPurchase: 300,
            validUntil: '2024-08-15',
            isActive: true,
            category: 'all'
        },
        {
            id: '4',
            code: 'DECOR25',
            title: 'Decor Sale',
            description: '25% off on home decor items',
            discount: '25% OFF',
            minPurchase: 50,
            validUntil: '2024-07-20',
            isActive: true,
            category: 'decor'
        },
        {
            id: '5',
            code: 'LIGHTING30',
            title: 'Lighting Special',
            description: '30% off on all lighting fixtures',
            discount: '30% OFF',
            minPurchase: 200,
            validUntil: '2024-09-10',
            isActive: true,
            category: 'lighting'
        },
        {
            id: '6',
            code: 'FLASH50',
            title: 'Flash Sale',
            description: '50% off on selected items',
            discount: '50% OFF',
            minPurchase: 150,
            validUntil: '2024-05-20',
            isActive: true,
            category: 'all'
        }
    ];

    const filteredCoupons = coupons.filter(coupon => {
        if (selectedCategory === 'all') return coupon.isActive;
        return coupon.isActive && coupon.category === selectedCategory;
    });

    // TODO: Implement coupon application functionality
    const handleApplyCoupon = (coupon: Coupon) => {
        Alert.alert('Coupon Feature', 'Coupon application feature coming soon!', [
            { text: 'OK', style: 'default' }
        ]);
    };

    const isCouponApplied = (couponId: string) => appliedCoupons.includes(couponId);

    const CouponCard = ({ coupon }: { coupon: Coupon }) => {
        const applied = isCouponApplied(coupon.id);
        
        return (
            <View style={[styles.couponCard, applied && styles.appliedCoupon]}>
                <View style={styles.couponHeader}>
                    <View style={styles.couponInfo}>
                        <Text style={styles.couponCode}>{coupon.code}</Text>
                        <Text style={styles.couponTitle}>{coupon.title}</Text>
                        <Text style={styles.couponDescription}>{coupon.description}</Text>
                    </View>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{coupon.discount}</Text>
                    </View>
                </View>
                
                <View style={styles.couponDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>Valid until {coupon.validUntil}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="card-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>Min. purchase ${coupon.minPurchase}</Text>
                    </View>
                </View>
                
                <TouchableOpacity
                    style={[styles.applyButton, applied && styles.removeButton]}
                    onPress={() => handleApplyCoupon(coupon)}
                >
                    <Ionicons 
                        name={applied ? "checkmark-circle" : "add-circle-outline"} 
                        size={20} 
                        color={applied ? "#fff" : "#00685C"} 
                    />
                    <Text style={[styles.applyButtonText, applied && styles.removeButtonText]}>
                        {applied ? 'Applied' : 'Apply Coupon'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Navbar title="My Coupons" showSearch={false} showBack={true} />
            
            <View style={styles.mainContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Available Coupons</Text>
                    <Text style={styles.headerSubtitle}>
                        Save money with these exclusive offers
                    </Text>
                </View>

                {/* Category Filter */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === category.id && styles.categoryChipActive
                                ]}
                                onPress={() => setSelectedCategory(category.id as any)}
                            >
                                <Ionicons 
                                    name={category.icon as any} 
                                    size={16} 
                                    color={selectedCategory === category.id ? '#fff' : '#666'} 
                                />
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category.id && styles.categoryTextActive
                                ]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Coupons List */}
                <ScrollView style={styles.couponsContainer} showsVerticalScrollIndicator={false}>
                    {filteredCoupons.length > 0 ? (
                        filteredCoupons.map((coupon) => (
                            <CouponCard key={coupon.id} coupon={coupon} />
                        ))
                    ) : (
                        <View style={styles.noCoupons}>
                            <Ionicons name="pricetag-outline" size={60} color="#ccc" />
                            <Text style={styles.noCouponsTitle}>No Coupons Available</Text>
                            <Text style={styles.noCouponsText}>
                                Check back later for new offers and discounts!
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Applied Coupons Summary */}
                {appliedCoupons.length > 0 && (
                    <View style={styles.appliedSummary}>
                        <Text style={styles.summaryTitle}>
                            Applied Coupons ({appliedCoupons.length})
                        </Text>
                        {appliedCoupons.map(couponId => {
                            const coupon = coupons.find(c => c.id === couponId);
                            return coupon ? (
                                <View key={couponId} style={styles.appliedCouponItem}>
                                    <Text style={styles.appliedCouponCode}>{coupon.code}</Text>
                                    <Text style={styles.appliedCouponDiscount}>{coupon.discount}</Text>
                                </View>
                            ) : null;
                        })}
                    </View>
                )}
            </View>
          </View>
      );
    };
    
    export default Cupens;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 60,
      },
      mainContainer: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    filterContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    categoryChipActive: {
        backgroundColor: '#00685C',
        borderColor: '#00685C',
    },
    categoryText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    categoryTextActive: {
        color: '#fff',
    },
    couponsContainer: {
        flex: 1,
        padding: 20,
    },
    couponCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    appliedCoupon: {
        borderColor: '#00685C',
        backgroundColor: '#f0f9f8',
    },
    couponHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    couponInfo: {
        flex: 1,
    },
    couponCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00685C',
        marginBottom: 4,
    },
    couponTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    couponDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    discountBadge: {
        backgroundColor: '#00685C',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    discountText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    couponDetails: {
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    applyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#00685C',
    },
    removeButton: {
        backgroundColor: '#00685C',
    },
    applyButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#00685C',
    },
    removeButtonText: {
        color: '#fff',
    },
    noCoupons: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    noCouponsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    noCouponsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    appliedSummary: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    appliedCouponItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    appliedCouponCode: {
        fontSize: 16,
        fontWeight: '500',
        color: '#00685C',
    },
    appliedCouponDiscount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});

