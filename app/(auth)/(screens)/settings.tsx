import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth, useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useThemePreference } from '../../context/themeContext';
import { useUserRole } from '../../hooks/useUserRole';

const SettingsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const { role } = useUserRole();
  const { preference, setPreference } = useThemePreference();

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'tint');
  const subtextColor = useThemeColor({}, 'icon'); // Use icon color for subtext
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault');
  const tabIconSelectedColor = useThemeColor({}, 'tabIconSelected');
  const border = useThemeColor({}, 'border');


  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.push('/(public)/login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Account deletion logic would go here
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch, switchValue, onSwitchChange, showArrow = true }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={showSwitch}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={primaryColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#ddd', true: '#00685C' }}
          thumbColor="#fff"
        />
      ) : showArrow ? (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      ) : null}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  // Admin settings view
  if (role === 'admin') {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Admin Settings</Text>
            </View>
            <View style={styles.sectionContent}>
              <SettingItem
                icon="person-outline"
                title="Profile Information"
                subtitle={user?.emailAddresses?.[0]?.emailAddress || 'No email set'}
                onPress={() => router.push('/(auth)/(tabs)/profile')}
              />
              <SettingItem
                icon="lock-closed-outline"
                title="Change Password"
                subtitle="Update your account password"
                onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
              />
              <SettingItem
                icon="notifications-outline"
                title="Notification Preferences"
                subtitle="Manage admin notifications"
                onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
              />
              <SettingItem
                icon="information-circle-outline"
                title="App Info"
                subtitle="Version and legal information"
                onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
              />
              <SettingItem
                icon="list-outline"
                title="View Orders"
                subtitle="See all customer orders"
                onPress={() => router.push('/(auth)/(screens)/orders')}
              />
              <SettingItem
                icon="pricetags-outline"
                title="Manage Coupons"
                subtitle="Create and manage discount coupons"
                onPress={() => router.push('/(auth)/(screens)/cupens')}
              />
            </View>
          </View>
          {/* Account Actions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Account Actions</Text>
            </View>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.dangerItem} onPress={handleSignOut}>
                <View style={styles.settingIcon}>
                  <Ionicons name="log-out-outline" size={24} color="#F44336" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.dangerText}>Sign Out</Text>
                  <Text style={styles.settingSubtitle}>Sign out of your account</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </View>
          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appVersion}>KB Furniture v1.0.0</Text>
            <Text style={styles.appCopyright}>© 2024 KB Furniture. All rights reserved.</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}> 
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <SectionHeader title="Account" />
          <View style={styles.sectionContent}>
            <SettingItem
              icon="person-outline"
              title="Profile Information"
              subtitle={user?.emailAddresses?.[0]?.emailAddress || 'No email set'}
              onPress={() => router.push('/(auth)/(tabs)/profile')}
            />
          </View>
        </View>

        {/* Preferences Section - Hidden for v1.0 */}
        {/* <View style={styles.section}>
          <SectionHeader title="Preferences" />
          <View style={styles.sectionContent}>
            <SettingItem
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Order updates and promotions"
              showSwitch={true}
              switchValue={notifications}
              onSwitchChange={setNotifications}
              showArrow={false}
            />
            <SettingItem
              icon="mail-outline"
              title="Email Updates"
              subtitle="Newsletter and promotional emails"
              showSwitch={true}
              switchValue={emailUpdates}
              onSwitchChange={setEmailUpdates}
              showArrow={false}
            />
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle={preference === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
              showSwitch={true}
              switchValue={preference === 'dark'}
              onSwitchChange={(val: boolean) => setPreference(val ? 'dark' : 'light')}
              showArrow={false}
            />
            <SettingItem
              icon="location-outline"
              title="Location Services"
              subtitle="Allow location-based features"
              showSwitch={true}
              switchValue={locationServices}
              onSwitchChange={setLocationServices}
              showArrow={false}
            />
          </View>
        </View> */}

        {/* Support Section */}
        <View style={styles.section}>
          <SectionHeader title="Support" />
          <View style={styles.sectionContent}>
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get help with your orders"
              onPress={() => router.push('/(auth)/(screens)/support')}
            />
            <SettingItem
              icon="document-text-outline"
              title="Legal & Policies"
              subtitle="Read our legal terms and policies"
              onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
            />
            {/* <SettingItem
              icon="shield-outline"
              title="Privacy Policy"
              subtitle="How we handle your data"
              onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
            /> */}
            <SettingItem
              icon="information-circle-outline"
              title="About"
              subtitle="App version and information"
              onPress={() => router.push('/(auth)/(screens)/about')}
            />
          </View>
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <SectionHeader title="Data & Privacy" />
          <View style={styles.sectionContent}>
            <SettingItem
              icon="trash-outline"
              title="Clear Cache"
              subtitle="Free up storage space"
              onPress={() => Alert.alert('Cache Cleared', 'App cache has been cleared successfully.')}
            />
          </View>
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <SectionHeader title="Account Actions" />
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.dangerItem} onPress={handleSignOut}>
              <View style={styles.settingIcon}>
                <Ionicons name="log-out-outline" size={24} color="#F44336" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.dangerText}>Sign Out</Text>
                <Text style={styles.settingSubtitle}>Sign out of your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appVersion}>KB Furniture v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 KB Furniture. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F44336',
    marginBottom: 2,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SettingsPage; 