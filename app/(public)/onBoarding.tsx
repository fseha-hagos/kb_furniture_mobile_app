//import liraries
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// create a component
const onBoarding = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    const steps = [
        {
            title: "Transform Your Space",
            subtitle: "Discover premium furniture that brings elegance and comfort to your home",
            image: require('@/assets/images/Designer(1).jpeg'),
            features: [
                { icon: "star" as const, text: "Premium Quality" },
                { icon: "shield-checkmark" as const, text: "Trusted Brand" },
                { icon: "heart" as const, text: "Loved by Thousands" }
            ]
        },
        {
            title: "Expert Service",
            subtitle: "Get personalized recommendations and professional support from our furniture experts",
            image: require('@/assets/images/Designer(1).jpeg'),
            features: [
                { icon: "people" as const, text: "Expert Consultation" },
                { icon: "chatbubbles" as const, text: "24/7 Support" },
                { icon: "checkmark-circle" as const, text: "Quality Guarantee" }
            ]
        },
        {
            title: "Fast & Secure",
            subtitle: "Enjoy quick delivery, secure payments, and hassle-free shopping experience",
            image: require('@/assets/images/Designer(1).jpeg'),
            features: [
                { icon: "rocket" as const, text: "Fast Delivery" },
                { icon: "card" as const, text: "Secure Payments" },
                { icon: "refresh" as const, text: "Easy Returns" }
            ]
        }
    ];

    useEffect(() => {
        animateStep();
    }, [currentStep]);

    const animateStep = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
        scaleAnim.setValue(0.8);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleContinue();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleContinue = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -50,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            router.replace('/(auth)/(tabs)/home');
        });
    };

    const currentStepData = steps[currentStep];

    return (
        <SafeAreaView style={styles.container}>
            {/* Background Gradient */}
            <LinearGradient
                colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
                style={styles.backgroundGradient}
            />
            
            {/* Background Pattern */}
            <View style={styles.patternOverlay} />
            
            {/* Header with Logo */}
            <View style={styles.header}>
                <Image 
                    source={require('@/assets/logo/kb-furniture-high-resolution-logo-transparent.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            
            {/* Main Content */}
            <Animated.View 
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ]
                    }
                ]}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Animated.Text style={[styles.mainTitle, { opacity: fadeAnim }]}>
                        {currentStepData.title}
                    </Animated.Text>
                    
                    <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
                        {currentStepData.subtitle}
                    </Animated.Text>
                </View>

                {/* Image Section */}
                <View style={styles.imageSection}>
                    <View style={styles.imageContainer}>
                        <ImageBackground 
                            source={currentStepData.image} 
                            style={styles.backgroundImage}
                            imageStyle={styles.backgroundImageStyle}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.7)']}
                                style={styles.imageOverlay}
                            />
                            
                            <View style={styles.imageContent}>
                                {currentStepData.features.map((feature, index) => (
                                    <Animated.View 
                                        key={index}
                                        style={[
                                            styles.featureCard,
                                            { 
                                                opacity: fadeAnim,
                                                transform: [{ translateX: slideAnim }]
                                            }
                                        ]}
                                    >
                                        <Ionicons name={feature.icon} size={24} color="#FBB04B" />
                                        <Text style={styles.featureText}>{feature.text}</Text>
                                    </Animated.View>
                                ))}
                            </View>
                        </ImageBackground>
                    </View>
                </View>

                {/* Action Section */}
                <View style={styles.actionSection}>
                    <View style={styles.buttonRow}>
                        {currentStep > 0 && (
                            <TouchableOpacity 
                                style={styles.previousButton} 
                                onPress={handlePrevious}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="arrow-back" size={20} color="#CCCCCC" />
                                <Text style={styles.previousButtonText}>Previous</Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#FBB04B', '#FFD700']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                                </Text>
                                <Ionicons 
                                    name={currentStep === steps.length - 1 ? "checkmark" : "arrow-forward"} 
                                    size={20} 
                                    color="#1a1a1a" 
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    
                    {currentStep === steps.length - 1 && (
                        <TouchableOpacity 
                            style={styles.secondaryButton} 
                            onPress={handleContinue}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>Skip for now</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { width: `${((currentStep + 1) / steps.length) * 100}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>Step {currentStep + 1} of {steps.length}</Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    patternOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundColor: 'transparent',
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
    },
    logo: {
        width: 190,
        height: 90,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 2,
       
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#CCCCCC',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    imageSection: {
        flex: 1,
        minHeight: 230,
        marginBottom: 40,
    },
    imageContainer: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    backgroundImageStyle: {
        borderRadius: 24,
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
    imageContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    featureText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginLeft: 12,
    },
    actionSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 16,
    },
    previousButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    previousButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#CCCCCC',
        marginLeft: 8,
    },
    primaryButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        shadowColor: '#FBB04B',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingHorizontal: 24,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginRight: 8,
    },
    secondaryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 16,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#CCCCCC',
        textDecorationLine: 'underline',
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressBar: {
        width: 120,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FBB04B',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#999999',
    },
});

//make this component available to the app
export default onBoarding;
