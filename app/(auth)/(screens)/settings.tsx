import { useThemeColor } from '@/hooks/useThemeColor';
import { LanguageCode, loadLanguage, setLanguage } from '@/utils/i18n';
import { useAuth, useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Updates from "expo-updates";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');

  useEffect(() => {
    loadLanguage().then(lang => setSelectedLang(lang));
  }, []);

  const handleLangChange = async (lang: LanguageCode) => {
    setSelectedLang(lang);
    await setLanguage(lang);
  };

    const handleClearCache = async () => {
      try {
        await AsyncStorage.clear();
        await Updates.reloadAsync();
        Alert.alert("Cache Cleared", "All local data has been removed.");
      } catch (error) {
        console.error("Clear cache error:", error);
        Alert.alert("Error", "Failed to clear cache.");
      }
    };

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
  
  const SettingLanguageItem = () => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={"globe-outline"} size={24} color={primaryColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{t('chooseLanguage')}</Text>
        <View style={styles.langOptions}>
                    <TouchableOpacity 
                      style={[styles.button, selectedLang === 'en' && styles.active]} 
                      onPress={() => handleLangChange('en')}
                    >
                      <Text>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.button, selectedLang === 'am' && styles.active]} 
                      onPress={() => handleLangChange('am')}
                    >
                      <Text>አማርኛ</Text>
                    </TouchableOpacity>
                  </View>
      </View>
    </View>
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
              <Text style={styles.sectionTitle}>{t('adminSettings')}</Text>
            </View>
            <View style={styles.sectionContent}>
              <SettingItem
                icon="person-outline"
                title={t('profileInformation')}
                subtitle={user?.emailAddresses?.[0]?.emailAddress || t('noEmailSet')}
                onPress={() => router.push('/(auth)/(screens)/editableProfileScreen')}
              />
              <SettingItem
                icon="lock-closed-outline"
                title={t('changePassword')}
                subtitle={t('updatePassword')}
                onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
              />
              <SettingItem
                icon="notifications-outline"
                title={t('notificationPreferences')}
                subtitle={t('manageAdminNotifications')}
                onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
              />
              <SettingItem
                icon="information-circle-outline"
                title={t('appInfo')}
                subtitle={t('versionAndLegalInfo')}
                onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
              />
              <SettingItem
                icon="list-outline"
                title={t('viewOrders')}
                subtitle="See all customer orders"
                onPress={() => router.push('/(auth)/(screens)/orders')}
              />
              <SettingItem
                icon="pricetags-outline"
                title={t('manageCoupons')}
                subtitle="Create and manage discount coupons"
                onPress={() => router.push('/(auth)/(screens)/cupens')}
              />
             
              <SettingLanguageItem />
              
            </View>
          </View>
          {/* Account Actions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('accountActions')}</Text>
            </View>
            
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.dangerItem} onPress={handleSignOut}>
                <View style={styles.settingIcon}>
                  <Ionicons name="log-out-outline" size={24} color="#F44336" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.dangerText}>{t('signOut')}</Text>
                  <Text style={styles.settingSubtitle}>{t('signOutSubtitle')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </View>
          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appVersion}>{t('appVersion')}</Text>
            <Text style={styles.appCopyright}>{t('appCopyright')}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}> 
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <SettingLanguageItem />

        {/* Account Section */}
        <View style={styles.section}>
          <SectionHeader title={t('account')} />
          <View style={styles.sectionContent}>
            <SettingItem
              icon="person-outline"
              title={t('profileInformation')}
              subtitle={user?.emailAddresses?.[0]?.emailAddress || t('noEmailSet')}
              onPress={() => router.push('/(auth)/(screens)/editableProfileScreen')}
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
          <SectionHeader title={t('support')}/>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="help-circle-outline"
              title={t('helpSupport')}
              subtitle={t('getHelpOrders')}
              onPress={() => router.push('/(auth)/(screens)/support')}
            />
            <SettingItem
              icon="document-text-outline"
              title={t('legalPolicies')}
              subtitle={t('readLegalTerms')}
              onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}
            />
            <SettingItem
              icon="information-circle-outline"
              title={t('about')}
              subtitle={t('appVersionInfo')}
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
              title={t('clearCache')}
              subtitle={t('freeUpStorage')}
              onPress={() => handleClearCache()}
            />
          </View>
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <SectionHeader title={t('accountActions')}/>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.dangerItem} onPress={handleSignOut}>
              <View style={styles.settingIcon}>
                <Ionicons name="log-out-outline" size={24} color="#F44336" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.dangerText}>{t('signOut')}</Text>
                <Text style={styles.settingSubtitle}>{t('signOutSubtitle')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appVersion}>{t('appVersion')}</Text>
          <Text style={styles.appCopyright}>{t('appCopyright')}</Text>
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

  
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  title: { fontSize: 16, marginTop: 20, marginBottom: 10, fontWeight: '600' },
  langOptions: { flexDirection: 'row', gap: 10 },
  button: { padding: 8, borderWidth: 1, borderRadius: 5 },
  active: { backgroundColor: '#ccc' },
});

export default SettingsPage; 