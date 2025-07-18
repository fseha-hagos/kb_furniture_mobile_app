import { useAuth, useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CacheManager from '../../components/CacheManager';
import CacheStatusIndicator from '../../components/CacheStatusIndicator';
import Navbar from '../../components/navbar';
import { useAuth as useCartAuth } from '../../context/cartContext';
import { useUserRole } from '../../hooks/useUserRole';

interface ProductStackParamList {
  addpost: { item: null };
}

const ACTIONS = [
  {
    key: 'addProduct',
    label: 'Add Product',
    icon: 'add-circle-outline',
    onPress: (router: any) => router.push('(screens)/addPostScreen'),
    adminOnly: true,
  },
  {
    key: 'addCategory',
    label: 'Add Category',
    icon: 'folder-open',
    onPress: (router: any) => router.push('(screens)/addCategoryScreen'),
    adminOnly: true,
  },
  {
    key: 'favorites',
    label: 'My Favorites',
    icon: 'heart-outline',
    onPress: (router: any) => router.push('/favorites'),
  },
  {
    key: 'cupens',
    label: 'My Cupen',
    icon: 'ticket-outline',
    onPress: (router: any) => router.push('/cupens'),
  },
  {
    key: 'clearCache',
    label: 'Clear Cache',
    icon: 'trash-outline',
    onPress: (_router: any, setShowCacheManager: any) => setShowCacheManager(true),
  },
  {
    key: 'terms',
    label: 'Terms and Conditions',
    icon: 'document-text-outline',
    onPress: (router: any) => router.push('/termsAndConditions'),
  },
];

const Profile = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<ProductStackParamList>>();
  const [showCacheManager, setShowCacheManager] = useState(false);
  const { refreshCart } = useCartAuth();
  const { role } = useUserRole();

  // Contact/social handlers
  const call = () => Linking.openURL('tel:+251948491265');
  const telegram = () => Linking.openURL('https://t.me/+251962588731/');
  const facebook = () => Linking.openURL('https://facebook.com/');
  const insta = () => Linking.openURL('https://t.me/+251962588731/');
  const tiktok = () => Linking.openURL('https://t.me/+251962588731/');

  // Filter actions based on role
  const filteredActions = ACTIONS.filter(action => {
    if (action.adminOnly && role !== 'admin') return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <Navbar title="Profile" showBack={true} showSearch={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileCard}>
          <Image
            source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')}
            style={styles.profileImg}
          />
          {isSignedIn ? (
            <>
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
            </>
          ) : (
            <>
              <Text style={styles.profileName}>Welcome, Guest!</Text>
              <Text style={styles.profilePhone}>Sign in to view your profile info</Text>
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
            </>
          )}
        </View>

        {/* Cache Status Indicator */}
        <View style={styles.cacheStatusContainer}>
          <CacheStatusIndicator onPress={() => setShowCacheManager(true)} showDetails={true} />
        </View>

        {/* Action List */}
        {isSignedIn && (
          <View style={styles.actionList}>
            {filteredActions.map((action, idx) => (
              <React.Fragment key={action.key}>
                <TouchableOpacity
                  style={styles.actionRow}
                  onPress={() => action.onPress(router, setShowCacheManager)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={action.icon as any} size={22} color="#00685C" style={styles.actionIcon} />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#B0B0B0" style={styles.chevronIcon} />
                </TouchableOpacity>
                {idx < filteredActions.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
            {/* Logout row, accent color */}
            <TouchableOpacity
              style={[styles.actionRow, styles.logoutRow]}
              onPress={async () => { await signOut(); }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="#DC3545" style={styles.actionIcon} />
              <Text style={[styles.actionLabel, { color: '#DC3545' }]}>Logout</Text>
              <Ionicons name="chevron-forward" size={20} color="#B0B0B0" style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  cacheStatusContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  actionList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    color: '#222',
    flex: 1,
    fontWeight: '500',
  },
  chevronIcon: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 54,
    marginRight: 0,
  },
  logoutRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  authButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    gap: 12,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 4,
  },
  signInButton: {
    backgroundColor: '#00685C',
  },
  signUpButton: {
    backgroundColor: '#00897B',
  },
  authButtonIcon: {
    marginRight: 8,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
