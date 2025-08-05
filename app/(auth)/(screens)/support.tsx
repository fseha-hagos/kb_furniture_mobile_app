import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const SupportPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Removed: const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: 'help-circle-outline' },
    { id: 'orders', name: 'Orders', icon: 'bag-outline' },
    { id: 'shipping', name: 'Shipping', icon: 'car-outline' },
    { id: 'returns', name: 'Returns', icon: 'refresh-outline' },
    { id: 'payment', name: 'Payment', icon: 'card-outline' },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by going to your profile and clicking on "Orders". You\'ll find tracking information for each order.',
      category: 'orders'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in original condition with all packaging intact.',
      category: 'returns'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Free shipping on orders over Birr 500.',
      category: 'shipping'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely.',
      category: 'payment'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Orders can be cancelled within 2 hours of placement. Contact our support team for assistance.',
      category: 'orders'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within the United States. We\'re working on expanding our shipping options.',
      category: 'shipping'
    },
    {
      question: 'How do I contact customer service?',
      answer: 'You can reach us via phone at +1-555-0123, email at support@kbfurniture.com, or through our live chat.',
      category: 'all'
    },
    {
      question: 'Are your products covered by warranty?',
      answer: 'All our furniture comes with a 1-year manufacturer warranty. Extended warranties are available for purchase.',
      category: 'all'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    // Removed: const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    // return matchesCategory && matchesSearch;
    return matchesCategory;
  });

  // TODO: Implement contact methods functionality
  const handleContact = (method: string) => {
    switch (method) {
      case 'phone':
        Linking.openURL('tel:+15550123');
        break;
      case 'email':
        Linking.openURL('mailto:support@kbfurniture.com');
        break;
      case 'chat':
        Alert.alert('Live Chat', 'Live chat feature coming soon!');
        break;
      case 'whatsapp':
        Alert.alert('WhatsApp', 'WhatsApp integration coming soon!');
        break;
    }
  };

  const ContactCard = ({ icon, title, subtitle, onPress, color }: any) => (
    <TouchableOpacity style={styles.contactCard} onPress={onPress}>
      <View style={[styles.contactIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const FAQItem = ({ faq }: { faq: FAQItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <View style={styles.faqItem}>
        <TouchableOpacity 
          style={styles.faqQuestion}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.faqQuestionText}>{faq.question}</Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{faq.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  // Custom Beautiful Navbar for Support Page
  const SupportNavbar = () => (
    <View style={styles.navbarContainer}>
      <LinearGradient
        colors={['#00685C', '#00897B', '#26A69A']}
        style={styles.navbarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.navbarBackButton}
          onPress={() => router.back()}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
            style={styles.backButtonGradient}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.navbarTitleContainer}>
          <View style={styles.titleIconContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.titleIconGradient}
            >
              <Ionicons name="help-circle" size={20} color="#00685C" />
            </LinearGradient>
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.navbarTitle}>Support Center</Text>
            <Text style={styles.navbarSubtitle}>We're here to help</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Beautiful Custom Navbar */}
      <SupportNavbar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Removed Search Bar */}

        {/* Contact Options */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <ContactCard
            icon="call-outline"
            title="Call Us"
            subtitle="+1 (555) 0123"
            onPress={() => handleContact('phone')}
            color="#4CAF50"
          />
          <ContactCard
            icon="mail-outline"
            title="Email Support"
            subtitle="support@kbfurniture.com"
            onPress={() => handleContact('email')}
            color="#2196F3"
          />
          <ContactCard
            icon="chatbubble-outline"
            title="Live Chat"
            subtitle="Available 24/7"
            onPress={() => handleContact('chat')}
            color="#FF9800"
          />
          <ContactCard
            icon="logo-whatsapp"
            title="WhatsApp"
            subtitle="Quick responses"
            onPress={() => handleContact('whatsapp')}
            color="#25D366"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}>
              <Ionicons name="document-text-outline" size={24} color="#00685C" />
              <Text style={styles.actionText}>Return Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#00685C" />
              <Text style={styles.actionText}>Warranty Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}>
              <Ionicons name="car-outline" size={24} color="#00685C" />
              <Text style={styles.actionText}>Shipping Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(auth)/(screens)/termsAndConditions')}>
              <Ionicons name="card-outline" size={24} color="#00685C" />
              <Text style={styles.actionText}>Payment Methods</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={selectedCategory === category.id ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ List */}
        <View style={styles.faqSection}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={40} color="#ccc" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>Try adjusting your search or category filter</Text>
            </View>
          )}
        </View>

        {/* Additional Support */}
        <View style={styles.additionalSupportSection}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <View style={styles.additionalSupportCard}>
            <Ionicons name="information-circle-outline" size={24} color="#00685C" />
            <Text style={styles.additionalSupportText}>
              Can't find what you're looking for? Our support team is available 24/7 to assist you with any questions or concerns.
            </Text>
          </View>
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
  // Beautiful Navbar Styles
  navbarContainer: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  navbarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    paddingTop: 6, // For status bar
    minHeight: 80,
  },
  navbarBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  backButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  navbarTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  titleIconContainer: {
    marginRight: 12,
  },
  titleIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleTextContainer: {
    alignItems: 'center',
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  navbarSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  navbarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  navbarActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  contactSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoriesScroll: {
    marginBottom: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryChipActive: {
    backgroundColor: '#00685C',
    borderColor: '#00685C',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  faqSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  additionalSupportSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  additionalSupportCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  additionalSupportText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12,
  },
});

export default SupportPage; 