import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProduct } from '../context/productContext';

const RecentlyViewed = () => {

  const tempLanguage = "en";

  const { recentlyViewed } = useProduct();
  const router = useRouter();

  const handleProductPress = (product: any) => {
    router.push({
      pathname: "/product",
      params: { productData: JSON.stringify(product) }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Viewed</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {recentlyViewed.map((product) => (
          <TouchableOpacity
            key={product.productId}
            style={styles.productCard}
            onPress={() => handleProductPress(product)}>
            <Image
              source={{ uri: product.images[0] }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name[tempLanguage]}
              </Text>
              <Text style={styles.productPrice}>Birr {product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00685C',
  },
});

export default RecentlyViewed; 