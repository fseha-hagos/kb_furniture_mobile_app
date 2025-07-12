import { slidesType } from '@/types/type';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Carousel Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong with the carousel.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const ImageWithRetry: React.FC<{ uri: string; style: any }> = ({ uri, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setHasError(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setRetryCount(0);
  };

  if (hasError) {
    return (
      <View style={[style, styles.errorImageContainer]}>
        <Text style={styles.errorImageText}>Failed to load image</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        source={{ uri }}
        style={[style, styles.slideImage]}
        resizeMode="cover"
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
      {isLoading && (
        <View style={[style, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#00685C" />
        </View>
      )}
    </View>
  );
};

const ItemsCarousel: React.FC<{ sliderList: slidesType[] }> = ({ sliderList }) => {
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sliderList && sliderList.length > 0) {
      setIsLoading(false);
      startAutoScroll(activeDotIndex);
    }
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [sliderList, activeDotIndex]);

  const startAutoScroll = (currentIndex: number) => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    
    autoScrollTimer.current = setInterval(() => {
      if (flatListRef.current && sliderList.length > 0) {
        const nextIndex = (currentIndex + 1) % sliderList.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveDotIndex(nextIndex);
      }
    }, 3000);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveDotIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const DotElement = ({ active }: { active: boolean }) => (
    <Animated.View 
      style={[
        styles.dotContainer, 
        active && styles.activeDotContainer,
        {
          transform: [{
            scale: active ? 1.2 : 1
          }]
        }
      ]}>
      <View style={[styles.dot, active && styles.activeDot]} />
    </Animated.View>
  );

  const renderItem = ({ item, index }: { item: slidesType; index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.slideContainer,
          {
            transform: [{ scale }],
            opacity,
          }
        ]}>
        <ImageWithRetry uri={item.image} style={styles.slideImage} />
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00685C" />
      </View>
    );
  }

  if (!sliderList || sliderList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No slides available</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={sliderList}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          style={styles.flatList}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          removeClippedSubviews={true}
          getItemLayout={(data: ArrayLike<slidesType> | null | undefined, index: number) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        <View style={styles.paginationContainer}>
          {sliderList.map((_, index) => (
            <DotElement key={index} active={index === activeDotIndex} />
          ))}
        </View>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginVertical: 5,
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    width: Dimensions.get('window').width,
    height:180,
    paddingHorizontal: 10,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dotContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDotContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
  },
  errorText: {
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00685C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorImageContainer: {
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImageText: {
    color: '#666',
    marginBottom: 10,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  emptyText: {
    color: '#666',
  },
});

export default ItemsCarousel;
