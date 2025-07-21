import { useAuth, useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SettingsPage from '../(screens)/settings';
import CacheManager from '../../components/CacheManager';
import Navbar from '../../components/navbar';
import UserDashboard from '../../components/UserDashboard';
import { useAuth as useCartAuth } from '../../context/cartContext';
import { useUserRole } from '../../hooks/useUserRole';

interface ProductStackParamList {
  addpost: { item: null };
}

const Profile = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<ProductStackParamList>>();
  const [showCacheManager, setShowCacheManager] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const { refreshCart, likedProducts } = useCartAuth();
  const { role } = useUserRole();

  // Mock data for dashboard
  const dashboardStats = {
    ordersCount: 12,
    favoritesCount: likedProducts?.length || 8,
    reviewsCount: 5,
    totalSpent: 2450,
  };

  const recentOrders = [
    { id: 'ORD001', status: 'Delivered', date: '2024-01-15', total: 299.99 },
    { id: 'ORD002', status: 'Shipped', date: '2024-01-10', total: 149.99 },
    { id: 'ORD003', status: 'Processing', date: '2024-01-08', total: 599.99 },
  ];

  const personalizedProducts = [
    { id: '1', name: 'Modern Sofa', price: 899.99 },
    { id: '2', name: 'Dining Table', price: 449.99 },
    { id: '3', name: 'Bed Frame', price: 299.99 },
    { id: '4', name: 'Office Chair', price: 199.99 },
  ];

  // Contact/social handlers
  const call = () => Linking.openURL('tel:+251948491265');
  const telegram = () => Linking.openURL('https://t.me/+251962588731/');
  const facebook = () => Linking.openURL('https://facebook.com/');
  const insta = () => Linking.openURL('https://t.me/+251962588731/');
  const tiktok = () => Linking.openURL('https://t.me/+251962588731/');


  return (
    <View style={styles.container}>
      <Navbar title="Profile" showBack={true} showSearch={false} />
      
      {isSignedIn ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Info */}
          <View style={styles.profileCard}>
            <Image
              source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')}
              style={styles.profileImg}
            />
            <Text style={styles.profileName}>{user?.firstName || 'User'} {user?.lastName || ''}</Text>
            <Text style={styles.profilePhone} onPress={call}>+251948491265</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialIcon} onPress={facebook}>
                <Image source={require('@/assets/logo/fb.png')} style={styles.iconImg} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={telegram}>
                <Image source={require('@/assets/logo/telegram.png')} style={styles.iconImg} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={insta}>
                <Image source={require('@/assets/logo/insta.png')} style={styles.iconImg} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={tiktok}>
                <Image source={require('@/assets/logo/google.png')} style={styles.iconImg} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dashboard Toggle */}
          <View style={styles.dashboardToggle}>
            <TouchableOpacity 
              style={[styles.toggleButton, showDashboard && styles.toggleButtonActive]}
              onPress={() => setShowDashboard(true)}
            >
              <Text style={[styles.toggleText, showDashboard && styles.toggleTextActive]}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !showDashboard && styles.toggleButtonActive]}
              onPress={() => setShowDashboard(false)}
            >
              <Text style={[styles.toggleText, !showDashboard && styles.toggleTextActive]}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Dashboard View */}
          {showDashboard ? (
            <UserDashboard 
              stats={{
                ...dashboardStats,
                ...(role === 'admin' ? { usersCount: 120, pendingOrdersCount: 3 } : {})
              }}
              recentOrders={recentOrders}
              personalizedProducts={personalizedProducts}
              role={role}
            />
          ) : (
            <>
            <SettingsPage   />
            </>
          )}
        </ScrollView>
      ) : (
        <View style={styles.guestContainer}>
          <Image
            source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')}
            style={styles.guestLogo}
          />
          <Text style={styles.guestTitle}>Welcome, Guest!</Text>
          <Text style={styles.guestSubtitle}>Sign in to view your profile and manage your account</Text>
          <View style={styles.authButtonRow}>
            <TouchableOpacity
              style={[styles.authButton, styles.signInButton]}
              onPress={() => router.push('/login')}
              activeOpacity={0.85}
            >
              <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.authButtonIcon} />
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, styles.signUpButton]}
              onPress={() => router.push('/register')}
              activeOpacity={0.85}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" style={styles.authButtonIcon} />
              <Text style={styles.authButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cache Manager Modal */}
      <CacheManager
        visible={showCacheManager}
        onClose={() => setShowCacheManager(false)}
        onCacheCleared={() => {
          refreshCart?.();
          setShowCacheManager(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingBottom: 40,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 0,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  profileImg: {
    width: 255,
    height: 85,
    borderRadius: 4,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 15,
    color: '#00685C',
    marginBottom: 8,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  iconImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  dashboardToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#00685C',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  cacheStatusContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  actionList: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 57,
  },
  logoutRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  guestLogo: {
    width: 200,
    height: 70,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  authButtonRow: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  authButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signInButton: {
    backgroundColor: '#00685C',
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00685C',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  authButtonIcon: {
    marginRight: 8,
  },
});

export default Profile;
