import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const AboutPage = () => {

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[primaryColor, primaryColor, ]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="information-circle-outline" size={40} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>About KB Furniture</Text>
        <Text style={styles.headerSubtitle}>Discover, Shop, and Enjoy Quality Furniture</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Our Mission</Text>
        <Text style={styles.paragraph }>
          KB Furniture is dedicated to making furniture shopping easy, enjoyable, and accessible for everyone. We offer a wide range of high-quality products, from modern sofas to classic dining sets, all at competitive prices.
        </Text>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Key Features</Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons name="search-outline" size={22} color={secondaryColor} style={styles.featureIcon} />
            <Text style={styles.featureText}>Browse and search a curated catalog of furniture</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cart-outline" size={22} color={secondaryColor} style={styles.featureIcon} />
            <Text style={styles.featureText}>Easy and secure online ordering</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="heart-outline" size={22} color={secondaryColor} style={styles.featureIcon} />
            <Text style={styles.featureText}>Save your favorites and create wishlists</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="star-outline" size={22} color={secondaryColor} style={styles.featureIcon} />
            <Text style={styles.featureText}>Read and write product reviews</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="chatbubbles-outline" size={22} color={secondaryColor} style={styles.featureIcon} />
            <Text style={styles.featureText}>24/7 customer support and live chat</Text>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Why Choose Us?</Text>
        <Text style={styles.paragraph}>
          We believe in quality, transparency, and customer satisfaction. Our team works tirelessly to bring you the best furniture deals and a seamless shopping experience. Thank you for choosing KB Furniture!
        </Text>
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
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 12,
  },
  headerIcon: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00685C',
    marginTop: 18,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
});

export default AboutPage; 