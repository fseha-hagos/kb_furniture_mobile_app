import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCacheStats, isCacheEmpty } from '../utils/cacheUtils';

interface CacheStatusIndicatorProps {
  onPress?: () => void;
  showDetails?: boolean;
}

const CacheStatusIndicator: React.FC<CacheStatusIndicatorProps> = ({
  onPress,
  showDetails = false,
}) => {
  const [cacheStats, setCacheStats] = useState<{
    totalItems: number;
    totalSize: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    loadCacheInfo();
  }, []);

  const loadCacheInfo = async () => {
    setLoading(true);
    try {
      const stats = await getCacheStats();
      const empty = await isCacheEmpty();
      setCacheStats(stats);
      setIsEmpty(empty);
    } catch (error) {
      console.error('Error loading cache info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#00685C" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.emptyContainer]}
        onPress={onPress}
        disabled={!onPress}
      >
        <Ionicons name="checkmark-circle" size={16} color="#00685C" />
        <Text style={styles.emptyText}>Cache Clean</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, styles.hasDataContainer]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Ionicons name="information-circle" size={16} color="#FFA500" />
      <Text style={styles.dataText}>
        {cacheStats?.totalItems} items • {cacheStats?.totalSize}
      </Text>
      {showDetails && (
        <Text style={styles.detailsText}>Tap to manage</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  emptyContainer: {
    backgroundColor: '#e8f5e8',
  },
  hasDataContainer: {
    backgroundColor: '#fff3cd',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#00685C',
    fontWeight: '500',
  },
  dataText: {
    fontSize: 12,
    color: '#FFA500',
    fontWeight: '500',
  },
  detailsText: {
    fontSize: 10,
    color: '#999',
    marginLeft: 4,
  },
});

export default CacheStatusIndicator; 