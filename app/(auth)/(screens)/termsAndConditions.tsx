//import liraries
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';

// create a component
const TermsAndConditions = () => {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('terms');
    
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');

    // Create styles with theme colors
    const getStyles = () => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: backgroundColor,
        },
        navbarContainer: {
            paddingBottom: 20,
        },
        navbarGradient: {
            paddingHorizontal: 20,
            paddingVertical: 15,
        },
        navbarContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
        },
        content: {
            flex: 1,
            padding: 20,
        },
        tabContainer: {
            flexDirection: 'row',
            marginBottom: 20,
            backgroundColor: cardColor,
            borderRadius: 12,
            padding: 4,
        },
        tab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'transparent',
        },
        activeTab: {
            backgroundColor: primaryColor,
            borderColor: primaryColor,
        },
        tabText: {
            marginLeft: 6,
            fontSize: 12,
            fontWeight: '500',
            color: primaryColor,
        },
        activeTabText: {
            color: '#fff',
        },
        sectionContent: {
            backgroundColor: cardColor,
            borderRadius: 12,
            padding: 20,
            marginBottom: 15,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: textColor,
            marginBottom: 10,
        },
        sectionText: {
            fontSize: 14,
            lineHeight: 22,
            color: textColor,
            marginBottom: 15,
        },
        listItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        bullet: {
            fontSize: 14,
            color: primaryColor,
            marginRight: 8,
            marginTop: 2,
        },
        listText: {
            flex: 1,
            fontSize: 14,
            lineHeight: 22,
            color: textColor,
        },
        navbarBackButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        backButtonGradient: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        navbarTitleContainer: {
            flex: 1,
            alignItems: 'center',
        },
        titleTextContainer: {
            alignItems: 'center',
        },
        navbarTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
        },
        contentContainer: {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 30,
        },
        lastUpdated: {
            fontSize: 12,
            color: textColor,
            opacity: 0.7,
            textAlign: 'center',
            marginBottom: 20,
        },
        contentTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: textColor,
            marginBottom: 10,
        },
        contentText: {
            fontSize: 14,
            lineHeight: 22,
            color: textColor,
            marginBottom: 15,
        },
        mainContainer: {
            flex: 1,
            backgroundColor: backgroundColor,
            paddingHorizontal: 20,
        },
        tabsContainer: {
            flexDirection: 'row',
            marginBottom: 20,
            backgroundColor: cardColor,
            borderRadius: 12,
            padding: 4,
            marginTop: 10,
        },
    });

    const styles = getStyles();

    const sections = [
        { id: 'terms', title: 'Terms of Service', icon: 'document-text-outline' },
        { id: 'privacy', title: 'Privacy Policy', icon: 'shield-outline' },
        { id: 'returns', title: 'Return Policy', icon: 'refresh-outline' },
        { id: 'shipping', title: 'Shipping Info', icon: 'car-outline' },
        { id: 'warranty', title: 'Warranty', icon: 'shield-checkmark-outline' },
    ];

    // Custom Beautiful Navbar for Terms Page
    const TermsNavbar = () => (
        <View style={styles.navbarContainer}>
            <LinearGradient
                colors={[primaryColor, primaryColor]}
                style={styles.navbarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.navbarContent}>
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
                        <View style={styles.titleTextContainer}>
                            <Text style={styles.navbarTitle}>Legal & Policies</Text>
                        </View>
                    </View>

                    {/* Spacer for balance */}
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>
        </View>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'terms':
                return (
                    <ScrollView style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Terms of Service</Text>
                        <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
                        
                        <Text style={styles.contentTitle}>1. Acceptance of Terms</Text>
                        <Text style={styles.contentText}>
                            By accessing and using the KB Furniture mobile application and website, you accept and agree to be bound by the terms and provision of this agreement.
                        </Text>

                        <Text style={styles.contentTitle}>2. Use License</Text>
                        <Text style={styles.contentText}>
                            Permission is granted to temporarily download one copy of the app for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                        </Text>

                        <Text style={styles.contentTitle}>3. User Account</Text>
                        <Text style={styles.contentText}>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </Text>

                        <Text style={styles.contentTitle}>4. Product Information</Text>
                        <Text style={styles.contentText}>
                            While we strive to provide accurate product information, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                        </Text>

                        <Text style={styles.contentTitle}>5. Pricing and Payment</Text>
                        <Text style={styles.contentText}>
                            All prices are subject to change without notice. Payment must be made at the time of order. We accept all major credit cards and PayPal.
                        </Text>

                        <Text style={styles.contentTitle}>6. Limitation of Liability</Text>
                        <Text style={styles.contentText}>
                            KB Furniture shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                        </Text>
                    </ScrollView>
                );

            case 'privacy':
                return (
                    <ScrollView style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Privacy Policy</Text>
                        <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
                        
                        <Text style={styles.contentTitle}>1. Information We Collect</Text>
                        <Text style={styles.contentText}>
                            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support.
                        </Text>

                        <Text style={styles.contentTitle}>2. How We Use Your Information</Text>
                        <Text style={styles.contentText}>
                            We use the information we collect to process transactions, send you technical notices, updates, security alerts, and support messages.
                        </Text>

                        <Text style={styles.contentTitle}>3. Information Sharing</Text>
                        <Text style={styles.contentText}>
                            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                        </Text>

                        <Text style={styles.contentTitle}>4. Data Security</Text>
                        <Text style={styles.contentText}>
                            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </Text>

                        <Text style={styles.contentTitle}>5. Cookies and Tracking</Text>
                        <Text style={styles.contentText}>
                            We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve and analyze our service.
                        </Text>

                        <Text style={styles.contentTitle}>6. Your Rights</Text>
                        <Text style={styles.contentText}>
                            You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time.
                        </Text>
                    </ScrollView>
                );

            case 'returns':
                return (
                    <ScrollView style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Return Policy</Text>
                        <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
                        
                        <Text style={styles.contentTitle}>1. Return Window</Text>
                        <Text style={styles.contentText}>
                            We offer a 30-day return policy for most items. Items must be returned in their original condition with all packaging and accessories included.
                        </Text>

                        <Text style={styles.contentTitle}>2. Return Process</Text>
                        <Text style={styles.contentText}>
                            To initiate a return, contact our customer service team. We'll provide you with a return authorization number and shipping label.
                        </Text>

                        <Text style={styles.contentTitle}>3. Non-Returnable Items</Text>
                        <Text style={styles.contentText}>
                            Custom furniture, clearance items, and items marked as final sale cannot be returned. Damaged or used items are also non-returnable.
                        </Text>

                        <Text style={styles.contentTitle}>4. Refund Process</Text>
                        <Text style={styles.contentText}>
                            Refunds will be processed within 5-7 business days after we receive your return. Original shipping costs are non-refundable.
                        </Text>

                        <Text style={styles.contentTitle}>5. Damaged Items</Text>
                        <Text style={styles.contentText}>
                            If you receive a damaged item, please contact us within 48 hours of delivery. We'll arrange for a replacement or refund.
                        </Text>

                        <Text style={styles.contentTitle}>6. Return Shipping</Text>
                        <Text style={styles.contentText}>
                            Return shipping costs are the responsibility of the customer unless the item was received damaged or incorrect.
                        </Text>
                    </ScrollView>
                );

            case 'shipping':
                return (
                    <ScrollView style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Shipping Information</Text>
                        <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
                        
                        <Text style={styles.contentTitle}>1. Shipping Methods</Text>
                        <Text style={styles.contentText}>
                            We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Free shipping is available on orders over Birr 500.
                        </Text>

                        <Text style={styles.contentTitle}>2. Delivery Areas</Text>
                        <Text style={styles.contentText}>
                            We currently ship to all 50 states in the United States. International shipping is not available at this time.
                        </Text>

                        <Text style={styles.contentTitle}>3. Order Processing</Text>
                        <Text style={styles.contentText}>
                            Orders are typically processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
                        </Text>

                        <Text style={styles.contentTitle}>4. Delivery Options</Text>
                        <Text style={styles.contentText}>
                            We offer room-of-choice delivery and white glove service for an additional fee. Assembly services are also available.
                        </Text>

                        <Text style={styles.contentTitle}>5. Tracking Your Order</Text>
                        <Text style={styles.contentText}>
                            Track your order through your account or using the tracking number provided in your shipping confirmation email.
                        </Text>

                        <Text style={styles.contentTitle}>6. Delivery Issues</Text>
                        <Text style={styles.contentText}>
                            If you experience delivery issues, please contact our customer service team immediately. We'll work to resolve any problems quickly.
                        </Text>
                    </ScrollView>
                );

            case 'warranty':
                return (
                    <ScrollView style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Warranty Information</Text>
                        <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
                        
                        <Text style={styles.contentTitle}>1. Standard Warranty</Text>
                        <Text style={styles.contentText}>
                            All KB Furniture products come with a 1-year manufacturer warranty covering defects in materials and workmanship.
                        </Text>

                        <Text style={styles.contentTitle}>2. Extended Warranty</Text>
                        <Text style={styles.contentText}>
                            Extended warranty options are available for purchase, providing additional coverage for up to 5 years.
                        </Text>

                        <Text style={styles.contentTitle}>3. Warranty Coverage</Text>
                        <Text style={styles.contentText}>
                            Warranty covers structural defects, manufacturing flaws, and hardware failures. Normal wear and tear is not covered.
                        </Text>

                        <Text style={styles.contentTitle}>4. Warranty Claims</Text>
                        <Text style={styles.contentText}>
                            To file a warranty claim, contact our customer service team with photos and a description of the issue.
                        </Text>

                        <Text style={styles.contentTitle}>5. Warranty Exclusions</Text>
                        <Text style={styles.contentText}>
                            Warranty does not cover damage from misuse, accidents, improper assembly, or modifications to the product.
                        </Text>

                        <Text style={styles.contentTitle}>6. Warranty Service</Text>
                        <Text style={styles.contentText}>
                            Warranty service may include repair, replacement, or refund at our discretion. Shipping costs for warranty service are covered by KB Furniture.
                        </Text>
                    </ScrollView>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Beautiful Custom Navbar */}
            <TermsNavbar />
            
            <View style={styles.mainContainer}>
                {/* Section Tabs */}
                <View style={styles.tabsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {sections.map((section) => (
                            <TouchableOpacity
                                key={section.id}
                                style={[
                                    styles.tab,
                                    activeSection === section.id && styles.activeTab
                                ]}
                                onPress={() => setActiveSection(section.id)}
                            >
                                <Ionicons 
                                    name={section.icon as any} 
                                    size={20} 
                                    color={activeSection === section.id ? '#fff' : primaryColor} 
                                />
                                <Text style={[
                                    styles.tabText,
                                    activeSection === section.id && styles.activeTabText
                                ]}>
                                    {section.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Content */}
                {renderContent()}
            </View>
        </View>
    );
};

export default TermsAndConditions;

