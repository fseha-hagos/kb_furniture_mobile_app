import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import {
  CacheItem,
  CacheStats,
  clearAllCache,
  clearSpecificCache,
  getCacheStats,
  isCacheEmpty,
} from '../utils/cacheUtils';

const { width } = Dimensions.get('window');

interface CacheManagerProps {
  visible: boolean;
  onClose: () => void;
  onCacheCleared?: () => void;
}

const CacheManager: React.FC<CacheManagerProps> = ({
  visible,
  onClose,
  onCacheCleared,
}) => {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');

  // Create styles with theme colors
  const getStyles = () => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: cardColor,
      borderRadius: 20,
      width: width * 0.9,
      maxWidth: 400,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: textColor,
    },
    closeButton: {
      padding: 5,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: textColor,
    },
    statsContainer: {
      marginBottom: 20,
    },
    statsGradient: {
      borderRadius: 15,
      padding: 20,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 15,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    statLabel: {
      fontSize: 14,
      color: '#fff',
      opacity: 0.8,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: textColor,
      marginBottom: 5,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: textColor,
      opacity: 0.7,
    },
    itemsContainer: {
      gap: 10,
    },
    cacheItem: {
      backgroundColor: backgroundColor,
      borderRadius: 12,
      padding: 15,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedItem: {
      borderColor: primaryColor,
      backgroundColor: '#e8f5e8',
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 14,
      color: textColor,
      opacity: 0.7,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemSize: {
      fontSize: 12,
      color: textColor,
      opacity: 0.5,
      marginRight: 10,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: textColor,
      marginTop: 10,
    },
    emptySubtext: {
      fontSize: 14,
      color: textColor,
      opacity: 0.7,
      marginTop: 5,
    },
    errorContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    errorText: {
      fontSize: 16,
      color: '#DC3545',
      marginTop: 10,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: 15,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: primaryColor,
      borderRadius: 8,
    },
    retryText: {
      color: 'white',
      fontWeight: '600',
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      gap: 10,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      borderRadius: 12,
      gap: 8,
    },
    clearSelectedButton: {
      backgroundColor: primaryColor,
    },
    clearAllButton: {
      backgroundColor: '#DC3545',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  useEffect(() => {
    if (visible) {
      loadCacheStats();
      animateIn();
    } else {
      animateOut();
    }
  }, [visible]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadCacheStats = async () => {
    setLoading(true);
    try {
      const stats = await getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error loading cache stats:', error);
      Alert.alert('Error', 'Failed to load cache information');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (key: string) => {
    setSelectedItems(prev =>
      prev.includes(key)
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const handleClearSelected = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Selection', 'Please select items to clear');
      return;
    }

    Alert.alert(
      'Clear Selected Cache',
      `Are you sure you want to clear ${selectedItems.length} selected item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => performClearSelected(),
        },
      ]
    );
  };

  const performClearSelected = async () => {
    setIsClearing(true);
    try {
      const result = await clearSpecificCache(selectedItems);
      
      if (result.success) {
        Alert.alert(
          'Success',
          `Successfully cleared ${result.clearedItems.length} item(s)`,
          [{ text: 'OK', onPress: () => {
            setSelectedItems([]);
            loadCacheStats();
            onCacheCleared?.();
          }}]
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to clear some items. Errors: ${result.errors.join(', ')}`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to clear selected cache items');
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearAll = async () => {
    const isEmpty = await isCacheEmpty();
    if (isEmpty) {
      Alert.alert('Cache Empty', 'There is no cache to clear');
      return;
    }

    Alert.alert(
      'Clear All Cache',
      'This will clear all cached data including cart items, favorites, and recently viewed products. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => performClearAll(),
        },
      ]
    );
  };

  const performClearAll = async () => {
    setIsClearing(true);
    try {
      const result = await clearAllCache();
      
      if (result.success) {
        Alert.alert(
          'Success',
          'All cache has been cleared successfully',
          [{ text: 'OK', onPress: () => {
            setSelectedItems([]);
            loadCacheStats();
            onCacheCleared?.();
          }}]
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to clear some cache items. Errors: ${result.errors.join(', ')}`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to clear all cache');
    } finally {
      setIsClearing(false);
    }
  };

  const renderCacheItem = (item: CacheItem) => {
    const isSelected = selectedItems.includes(item.key);
    
    return (
      <TouchableOpacity
        key={item.key}
        style={[styles.cacheItem, isSelected && styles.selectedItem]}
        onPress={() => handleSelectItem(item.key)}
        activeOpacity={0.7}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          <View style={styles.itemActions}>
            <Text style={styles.itemSize}>{item.size}</Text>
            <Ionicons 
              name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} 
              size={24} 
              color={isSelected ? primaryColor : '#999'} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  const styles = getStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              maxHeight: '90%',
              minHeight: 300,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Cache Manager</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text style={styles.loadingText}>Loading cache information...</Text>
              </View>
            ) : cacheStats ? (
              <>
                <View style={styles.statsContainer}>
                  <LinearGradient
                    colors={[primaryColor, '#00897B']}
                    style={styles.statsGradient}
                  >
                    <Text style={styles.statsTitle}>Cache Overview</Text>
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{cacheStats.totalItems}</Text>
                        <Text style={styles.statLabel}>Items</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{cacheStats.totalSize}</Text>
                        <Text style={styles.statLabel}>Total Size</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Select Items to Clear</Text>
                  <Text style={styles.sectionSubtitle}>
                    Choose specific items to clear or clear all cache
                  </Text>
                </View>

                {cacheStats.items.length > 0 ? (
                  <View style={styles.itemsContainer}>
                    {cacheStats.items.map(renderCacheItem)}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="checkmark-circle" size={48} color={primaryColor} />
                    <Text style={styles.emptyText}>No cache data found</Text>
                    <Text style={styles.emptySubtext}>Your app is already optimized!</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color="#DC3545" />
                <Text style={styles.errorText}>Failed to load cache information</Text>
                <TouchableOpacity onPress={loadCacheStats} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {cacheStats && cacheStats.items.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.clearSelectedButton]}
                onPress={handleClearSelected}
                disabled={selectedItems.length === 0 || isClearing}
              >
                {isClearing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="trash-outline" size={20} color="white" />
                )}
                <Text style={styles.buttonText}>
                  {isClearing ? 'Clearing...' : `Clear Selected (${selectedItems.length})`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.clearAllButton]}
                onPress={handleClearAll}
                disabled={isClearing}
              >
                {isClearing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="trash-outline" size={20} color="white" />
                )}
                <Text style={styles.buttonText}>
                  {isClearing ? 'Clearing...' : 'Clear All Cache'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

export default CacheManager; 