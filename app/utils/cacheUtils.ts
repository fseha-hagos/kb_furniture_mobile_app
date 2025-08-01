import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Define all cache keys used in the app
export const CACHE_KEYS = {
  CARTS: 'carts',
  LIKED_PRODUCTS: 'liked-products',
  FAVORITES: 'favorites',
  RECENTLY_VIEWED: 'recentlyViewed',
  PRODUCTS_STORAGE: 'products_storage',
};

// Cache item interface for better type safety
export interface CacheItem {
  key: string;
  name: string;
  description: string;
  size?: string;
}

// Cache statistics interface
export interface CacheStats {
  totalItems: number;
  totalSize: string;
  items: CacheItem[];
}

// Helper to get byte length of a string (UTF-8)
const getByteLength = (str: string): number => {
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; // trail surrogate
  }
  return s;
};

/**
 * Get cache statistics including size and item details
 */
export const getCacheStats = async (): Promise<CacheStats> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = Object.values(CACHE_KEYS);
    const relevantKeys = allKeys.filter(key => cacheKeys.includes(key)) as (keyof typeof CACHE_KEYS)[];
    
    const items: CacheItem[] = [];
    let totalSize = 0;
    
    for (const key of relevantKeys) {
      try {
        const value = await AsyncStorage.getItem(String(key));
        if (value) {
          const size = getByteLength(value);
          totalSize += size;
          items.push({
            key: String(key),
            name: getCacheItemName(key),
            description: getCacheItemDescription(key),
            size: formatBytes(size),
          });
        }
      } catch (error) {
        console.error(`Error reading cache key ${key}:`, error);
      }
    }
    
    return {
      totalItems: items.length,
      totalSize: formatBytes(totalSize),
      items,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalItems: 0,
      totalSize: '0 B',
      items: [],
    };
  }
};

/**
 * Clear specific cache items
 */
export const clearSpecificCache = async (keys: string[]): Promise<{ success: boolean; clearedItems: string[]; errors: string[] }> => {
  const clearedItems: string[] = [];
  const errors: string[] = [];
  
  try {
    for (const key of keys) {
      try {
        await AsyncStorage.removeItem(key);
        clearedItems.push(key);
      } catch (error) {
        console.error(`Error clearing cache key ${key}:`, error);
        errors.push(key);
      }
    }
    
    return {
      success: errors.length === 0,
      clearedItems,
      errors,
    };
  } catch (error) {
    console.error('Error in clearSpecificCache:', error);
    return {
      success: false,
      clearedItems: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
};

/**
 * Clear all cache data
 */
export const clearAllCache = async (): Promise<{ success: boolean; clearedItems: string[]; errors: string[] }> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = Object.values(CACHE_KEYS);
    const relevantKeys: string[] = allKeys.filter(key => cacheKeys.includes(key));
    
    return await clearSpecificCache(relevantKeys);
  } catch (error) {
    console.error('Error in clearAllCache:', error);
    return {
      success: false,
      clearedItems: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
};

/**
 * Clear secure storage (if needed)
 */
export const clearSecureStorage = async (): Promise<{ success: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  try {
    // Clear any secure tokens or sensitive data
    const secureKeys = ['clerk-token', 'auth-token', 'user-session'];
    
    for (const key of secureKeys) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error(`Error clearing secure storage key ${key}:`, error);
        errors.push(key);
      }
    }
    
    return {
      success: errors.length === 0,
      errors,
    };
  } catch (error) {
    console.error('Error in clearSecureStorage:', error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
};

/**
 * Get user-friendly name for cache items
 */
const getCacheItemName = (key: string | number): string => {
  const names: Record<string, string> = {
    [CACHE_KEYS.CARTS]: 'Shopping Cart',
    [CACHE_KEYS.LIKED_PRODUCTS]: 'Liked Products',
    [CACHE_KEYS.FAVORITES]: 'Favorites',
    [CACHE_KEYS.RECENTLY_VIEWED]: 'Recently Viewed',
    [CACHE_KEYS.PRODUCTS_STORAGE]: 'Product Data',
  };
  return names[String(key)] || String(key);
};

/**
 * Get description for cache items
 */
const getCacheItemDescription = (key: string | number): string => {
  const descriptions: Record<string, string> = {
    [CACHE_KEYS.CARTS]: 'Items in your shopping cart',
    [CACHE_KEYS.LIKED_PRODUCTS]: 'Products you have liked',
    [CACHE_KEYS.FAVORITES]: 'Your favorite products',
    [CACHE_KEYS.RECENTLY_VIEWED]: 'Products you recently viewed',
    [CACHE_KEYS.PRODUCTS_STORAGE]: 'Cached product information',
  };
  return descriptions[String(key)] || 'Cached data';
};

/**
 * Format bytes to human readable format
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if cache is empty
 */
export const isCacheEmpty = async (): Promise<boolean> => {
  try {
    const stats = await getCacheStats();
    return stats.totalItems === 0;
  } catch (error) {
    console.error('Error checking if cache is empty:', error);
    return true;
  }
};

// Default export for the main cache utilities
const cacheUtils = {
  getCacheStats,
  clearSpecificCache,
  clearAllCache,
  clearSecureStorage,
  isCacheEmpty,
  CACHE_KEYS,
};

export default cacheUtils; 