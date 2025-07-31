import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAuth } from '../context/cartContext';

interface DashboardStats {
  ordersCount: number;
  favoritesCount: number;
  reviewsCount: number;
  totalSpent: number;
  usersCount?: number;
  pendingOrdersCount?: number;
}

interface UserDashboardProps {
  stats: DashboardStats;
  recentOrders: any[];
  personalizedProducts: any[];
  role?: string | null;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  stats, 
  recentOrders, 
  personalizedProducts,
  role
}) => {
  const router = useRouter();
  const { carts } = useAuth();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'tint');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor
    },
    welcomeSection: {
      padding: 20,
      backgroundColor: cardColor,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: accentColor,
    },
    statsSection: {
      padding: 20,
      backgroundColor: cardColor,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: textColor,
      marginBottom: 15,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: '48%',
      backgroundColor: backgroundColor,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: primaryColor,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    statIcon: {
      marginBottom: 8,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: accentColor,
    },
    quickActionsSection: {
      padding: 20,
      backgroundColor: cardColor,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionCard: {
      width: '48%',
      backgroundColor: backgroundColor,
      padding: 20,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    actionText: {
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
      marginTop: 8,
      textAlign: 'center',
    },
    ordersSection: {
      padding: 20,
      backgroundColor: cardColor,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    viewAllText: {
      fontSize: 14,
      color: primaryColor,
      fontWeight: '500',
    },
    orderCard: {
      width: 200,
      backgroundColor: backgroundColor,
      padding: 15,
      borderRadius: 10,
      marginRight: 15,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    orderId: {
      fontSize: 14,
      fontWeight: '600',
      color: textColor,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: primaryColor,
    },
    statusText: {
      fontSize: 12,
      color: cardColor,
      fontWeight: '500',
    },
    orderDate: {
      fontSize: 12,
      color: accentColor,
      marginBottom: 4,
    },
    orderTotal: {
      fontSize: 16,
      fontWeight: '600',
      color: primaryColor,
    },
    recommendationsSection: {
      padding: 20,
      backgroundColor: cardColor,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    productCard: {
      width: 150,
      backgroundColor: backgroundColor,
      padding: 15,
      borderRadius: 10,
      marginRight: 15,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    productImage: {
      width: 80,
      height: 80,
      backgroundColor: cardColor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: borderColor,
    },
    productName: {
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
      textAlign: 'center',
      marginBottom: 5,
    },
    productPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: primaryColor,
    },
  });

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} style={styles.statIcon} />
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const OrderCard = ({ order }: any) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => router.push('/(auth)/(screens)/product')}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.orderDate}>{order.date}</Text>
      <Text style={styles.orderTotal}>${order.total}</Text>
    </TouchableOpacity>
  );

  const ProductCard = ({ product }: any) => (
    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/(auth)/(screens)/product')}>
      <View style={styles.productImage}>
        <Ionicons name="image-outline" size={40} color="#ccc" />
      </View>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'shipped': return '#2196F3';
      case 'processing': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (role === 'admin') {
    // Admin dashboard view: business stats and recent orders only
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Business overview and order management</Text>
        </View>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Business Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              icon="bag-outline" 
              value={stats.ordersCount} 
              label="Total Orders" 
              color="#4CAF50" 
            />
            <StatCard 
              icon="wallet-outline" 
              value={`$${stats.totalSpent}`} 
              label="Total Sales" 
              color="#2196F3" 
            />
            <StatCard 
              icon="people-outline" 
              value={stats.usersCount || 0} 
              label="Total Users" 
              color="#8E24AA" 
            />
            <StatCard 
              icon="time-outline" 
              value={stats.pendingOrdersCount || 0} 
              label="Pending Orders" 
              color="#FF9800" 
            />
          </View>
        </View>
        {/* Admin Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/addCategoryScreen')}>
              <Ionicons name="add-circle-outline" size={24} color="#00685C" />
              <Text style={styles.actionText}>Add Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/addPostScreen')}>
              <Ionicons name="add-circle-outline" size={24} color={primaryColor} />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/cupens')}>
              <Ionicons name="pricetags-outline" size={24} color={primaryColor} />
              <Text style={styles.actionText}>Manage Coupons</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/orders')}>
              <Ionicons name="list-outline" size={24} color={primaryColor} />
              <Text style={styles.actionText}>View Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <View style={styles.ordersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/(screens)/orders')}>
                <Text style={styles.viewAllText}>Manage Orders</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentOrders.map((order, index) => (
                <OrderCard key={index} order={order} />
              ))}
            </ScrollView>
          </View>
        )}
        {/* Future: Add analytics and user management here */}
      </ScrollView>
    );
  }

  // Define action interface for better type safety
  interface DashboardAction {
    icon: any;
    value?: number | string;
    label: string;
    color: string;
    onPress?: () => void;
  }

  // Merged Activity & Actions for normal users
  const mergedActions: DashboardAction[] = [
    // TODO: Implement orders functionality
    // {
    //   icon: 'bag-outline' as any,
    //   value: stats.ordersCount,
    //   label: 'Orders',
    //   color: '#4CAF50',
    //   onPress: () => router.push('/(auth)/(screens)/itemList'),
    // },
    {
      icon: 'heart-outline' as any,
      value: stats.favoritesCount,
      label: 'Favorites',
      color: '#E91E63',
      onPress: () => router.push('/favorites'),
    },
    // TODO: Implement reviews functionality
    // {
    //   icon: 'star-outline' as any,
    //   value: stats.reviewsCount,
    //   label: 'Reviews',
    //   color: '#FF9800',
    //   onPress: () => Alert.alert('Coming Soon', 'Reviews management will be available in the next update.'),
    // },
    // TODO: Implement total spent tracking
    // {
    //   icon: 'wallet-outline' as any,
    //   value: `$${stats.totalSpent}`,
    //   label: 'Total Spent',
    //   color: '#2196F3',
    //   onPress: undefined,
    // },
    {
      icon: 'cart-outline' as any,
      value: carts?.length || 0,
      label: 'Cart',
      color: '#00685C',
      onPress: () => router.push('/cart'),
    },
    {
      icon: 'help-circle-outline' as any,
      value: undefined,
      label: 'Support',
      color: '#2196F3',
      onPress: () => router.push('/(auth)/(screens)/termsAndConditions'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.subtitle}>Here's what's happening with your account</Text>
      </View>

      {/* Merged Activity & Actions Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Activity & Quick Actions</Text>
        <View style={styles.statsGrid}>
          {mergedActions.map((action, idx) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.statCard, { shadowColor: action.color }]}
              onPress={action.onPress}
              disabled={!action.onPress}
              activeOpacity={action.onPress ? 0.7 : 1}
            >
              <Ionicons name={action.icon} size={24} color={action.color} style={styles.statIcon} />
              {action.value !== undefined && (
                <Text style={styles.statNumber}>{action.value}</Text>
              )}
              <Text style={styles.statLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Orders - Hidden for v1.0 */}
      {/* {recentOrders.length > 0 && (
        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/(screens)/itemList')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentOrders.map((order, index) => (
              <OrderCard key={index} order={order} />
            ))}
          </ScrollView>
        </View>
      )} */}

      {/* Personalized Recommendations */}
      {/* {personalizedProducts.length > 0 && (
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {personalizedProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </ScrollView>
        </View>
      )} */}
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: backgroundColor
//   },
//   welcomeSection: {
//     padding: 20,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//   },
//   statsSection: {
//     padding: 20,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 15,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: '48%',
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderLeftWidth: 4,
//     elevation: 2,
//     // shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   statIcon: {
//     marginBottom: 8,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   quickActionsSection: {
//     padding: 20,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   actionsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   actionCard: {
//     width: '48%',
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 10,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   actionText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   ordersSection: {
//     padding: 20,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: '#00685C',
//     fontWeight: '500',
//   },
//   orderCard: {
//     width: 200,
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     marginRight: 15,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   orderId: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   orderDate: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   orderTotal: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#00685C',
//   },
//   recommendationsSection: {
//     padding: 20,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   productCard: {
//     width: 150,
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     marginRight: 15,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#00685C',
//   },
// });

export default UserDashboard; 