import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Navbar from '../../components/navbar';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'price-drop';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const NotificationsPage = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #ORD001 has been shipped and is on its way!',
      timestamp: '2 hours ago',
      read: false,
      actionUrl: '/order/ORD001'
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on all sofas this weekend only!',
      timestamp: '1 day ago',
      read: false,
      actionUrl: '/promotions'
    },
    {
      id: '3',
      type: 'price-drop',
      title: 'Price Drop Alert',
      message: 'The Modern Sofa you liked is now 15% cheaper!',
      timestamp: '2 days ago',
      read: true,
      actionUrl: '/product/sofa-1'
    },
    {
      id: '4',
      type: 'system',
      title: 'Welcome to KB Furniture',
      message: 'Thank you for joining us! Explore our latest collection.',
      timestamp: '3 days ago',
      read: true
    },
    {
      id: '5',
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #ORD002 has been delivered successfully.',
      timestamp: '1 week ago',
      read: true,
      actionUrl: '/order/ORD002'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'order' | 'promotion'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'bag-outline';
      case 'promotion':
        return 'pricetag-outline';
      case 'price-drop':
        return 'trending-down-outline';
      case 'system':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return '#4CAF50';
      case 'promotion':
        return '#FF9800';
      case 'price-drop':
        return '#E91E63';
      case 'system':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== id));
          }
        }
      ]
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
          }
        }
      ]
    );
  };

  // TODO: Implement notification navigation functionality
  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    Alert.alert('Notification', 'Notification navigation feature coming soon!', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !notification.read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationIcon}>
        <Ionicons 
          name={getNotificationIcon(notification.type) as any} 
          size={24} 
          color={getNotificationColor(notification.type)} 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteNotification(notification.id)}
          >
            <Ionicons name="close" size={16} color="#999" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.timestamp}</Text>
      </View>
      
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <Navbar title="Notifications" showBack={true} showSearch={false} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={markAllAsRead}>
            <Ionicons name="checkmark-done" size={20} color="#00685C" />
            <Text style={styles.headerButtonText}>Mark All Read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={clearAllNotifications}>
            <Ionicons name="trash-outline" size={20} color="#F44336" />
            <Text style={[styles.headerButtonText, { color: '#F44336' }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton filter="all" label="All" />
          <FilterButton filter="unread" label="Unread" count={unreadCount} />
          <FilterButton filter="order" label="Orders" />
          <FilterButton filter="promotion" label="Promotions" />
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateSubtitle}>
              {selectedFilter === 'all' 
                ? 'You\'re all caught up!' 
                : `No ${selectedFilter} notifications found`
              }
            </Text>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  headerButtonText: {
    fontSize: 14,
    color: '#00685C',
    fontWeight: '500',
    marginLeft: 5,
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
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
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
  },
});

export default NotificationsPage; 