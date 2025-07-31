import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Navbar from '../../components/navbar';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrdersPage = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  const orders: Order[] = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: [
        { productId: '1', name: 'Modern Sofa', price: 299.99, quantity: 1, color: 'Gray' }
      ],
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-20'
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      status: 'shipped',
      total: 449.98,
      items: [
        { productId: '2', name: 'Dining Table', price: 299.99, quantity: 1, color: 'Brown' },
        { productId: '3', name: 'Dining Chairs', price: 149.99, quantity: 1, color: 'Brown' }
      ],
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-18'
    },
    {
      id: 'ORD003',
      date: '2024-01-08',
      status: 'processing',
      total: 599.99,
      items: [
        { productId: '4', name: 'Bed Frame', price: 399.99, quantity: 1, color: 'Black' },
        { productId: '5', name: 'Mattress', price: 199.99, quantity: 1, color: 'White' }
      ],
      estimatedDelivery: '2024-01-25'
    },
    {
      id: 'ORD004',
      date: '2024-01-05',
      status: 'pending',
      total: 199.99,
      items: [
        { productId: '6', name: 'Office Chair', price: 199.99, quantity: 1, color: 'Black' }
      ],
      estimatedDelivery: '2024-01-30'
    },
    {
      id: 'ORD005',
      date: '2024-01-01',
      status: 'cancelled',
      total: 899.99,
      items: [
        { productId: '7', name: 'Sectional Sofa', price: 899.99, quantity: 1, color: 'Beige' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#4CAF50';
      case 'shipped': return '#2196F3';
      case 'processing': return '#FF9800';
      case 'pending': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return 'checkmark-circle';
      case 'shipped': return 'car';
      case 'processing': return 'time';
      case 'pending': return 'hourglass';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  // TODO: Implement order cancellation functionality
  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Order cancellation feature coming soon!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  // TODO: Implement reorder functionality
  const handleReorder = (order: Order) => {
    Alert.alert('Reorder', 'Reorder feature coming soon!', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  const OrderCard = ({ order }: { order: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>#{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Ionicons name={getStatusIcon(order.status) as any} size={16} color="#fff" />
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemImage}>
              <Ionicons name="image-outline" size={20} color="#ccc" />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemColor}>Color: {item.color}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderTotal}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${order.total}</Text>
        </View>
        
        <View style={styles.orderActions}>
          {order.status === 'pending' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleCancelOrder(order.id)}
            >
              <Ionicons name="close-circle-outline" size={16} color="#F44336" />
              <Text style={[styles.actionText, { color: '#F44336' }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          
          {order.status === 'delivered' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(auth)/(screens)/product')}
            >
              <Ionicons name="star-outline" size={16} color="#FF9800" />
              <Text style={[styles.actionText, { color: '#FF9800' }]}>Review</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReorder(order)}
          >
            <Ionicons name="refresh-outline" size={16} color="#00685C" />
            <Text style={[styles.actionText, { color: '#00685C' }]}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </View>

      {order.trackingNumber && (
        <View style={styles.trackingInfo}>
          <Text style={styles.trackingLabel}>Tracking Number:</Text>
          <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
          {order.estimatedDelivery && (
            <Text style={styles.estimatedDelivery}>
              Estimated Delivery: {order.estimatedDelivery}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const FilterButton = ({ filter, label, count }: { filter: string; label: string; count?: number }) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(filter as any)}
    >
      <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const getFilterCount = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  return (
    <View style={styles.container}>
      <Navbar title="Order History" showBack={true} showSearch={false} />
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton filter="all" label="All" count={orders.length} />
          <FilterButton filter="pending" label="Pending" count={getFilterCount('pending')} />
          <FilterButton filter="processing" label="Processing" count={getFilterCount('processing')} />
          <FilterButton filter="shipped" label="Shipped" count={getFilterCount('shipped')} />
          <FilterButton filter="delivered" label="Delivered" count={getFilterCount('delivered')} />
          <FilterButton filter="cancelled" label="Cancelled" count={getFilterCount('cancelled')} />
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No orders found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {selectedFilter === 'all' 
                ? 'You haven\'t placed any orders yet.' 
                : `No ${selectedFilter} orders found`
              }
            </Text>
            <TouchableOpacity 
              style={styles.shopNowButton}
              onPress={() => router.push('/(auth)/(tabs)/home')}
            >
              <Text style={styles.shopNowText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#00685C',
    borderColor: '#00685C',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: '#E91E63',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 5,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  itemColor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00685C',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00685C',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  trackingInfo: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  trackingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  estimatedDelivery: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
});

export default OrdersPage; 