//import liraries
import { categoriesType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface prop {
    index: number,
    item : categoriesType,
    selectedCategory: categoriesType | null,
    onSelect: (item: categoriesType)=> void,
    scrollOpacity?: Animated.Value,
    containerHeight?: Animated.Value,
    isCompact?: boolean,
}

// create a component
const CategoryCardView = ({index, item, selectedCategory, onSelect, scrollOpacity, containerHeight, isCompact}: prop) => {
    const isSelected = selectedCategory?.categoryId === item.categoryId;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.8)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const compactScaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animate compact mode scale
        Animated.timing(compactScaleAnim, {
            toValue: isCompact ? 0.88 : 1,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [isCompact]);

    useEffect(() => {
        // Staggered entrance animation with bounce
        Animated.sequence([
            Animated.delay(index * 100),
            Animated.spring(translateYAnim, {
                toValue: 0,
                speed: 12,
                bounciness: 14,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 900,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = () => {
        // Press animation with shadow/scale
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1.08,
                    duration: 160,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 120,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 80,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 120,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        onSelect(item);
    };

    const selectedScale = isSelected ? 1.06 : 1;
    const selectedElevation = isSelected ? 16 : 4;
    const selectedShadowColor = isSelected ? '#00e6c3' : '#000';
    const selectedBorderColor = isSelected ? '#00e6c3' : '#eee';
    const selectedBorderWidth = isSelected ? 2.5 : 1;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        { scale: Animated.multiply(scaleAnim, Animated.multiply(selectedScale, compactScaleAnim)) },
                        { translateY: translateYAnim },
                        {
                            rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '5deg'],
                            }),
                        },
                    ],
                    opacity: opacityAnim,
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.categoryContainer,
                    {
                        elevation: selectedElevation,
                        shadowOpacity: isSelected ? 0.45 : 0.2,
                        shadowColor: selectedShadowColor,
                        borderColor: selectedBorderColor,
                        borderWidth: selectedBorderWidth,
                        height: containerHeight ? 
                            Animated.add(containerHeight, -26) : // 126 - 26 = 100 (adjusted card height)
                            110,
                        backgroundColor: isSelected ? '#e0f7fa' : '#fff',
                    },
                ]}
            >
                <TouchableOpacity 
                    onPress={handlePress}
                    style={{ flex: 1 }}
                    activeOpacity={0.8}
                >
                <LinearGradient
                    colors={['rgba(255,255,255,0.0)', 'rgba(0,104,92,0.10)']}
                    style={styles.gradientBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.imageContainer}>
                        {item.categoryId !== 'all' ? (
                            <Animated.View style={[
                                styles.imageWrapper,
                                {
                                    opacity: scrollOpacity || 1,
                                    transform: [
                                        { scale: compactScaleAnim },
                                    ],
                                }
                            ]}>
                                <Image 
                                    source={{uri: item.image}} 
                                    style={styles.coverImage}
                                    resizeMode="cover"
                                />
                                {/* Gradient overlay for readability */}
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.18)']}
                                    style={styles.imageGradientOverlay}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                />
                            </Animated.View>
                        ) : (
                            <View style={[
                                styles.allIconContainer,
                                isSelected && styles.selectedIconContainer
                            ]}>
                                <Ionicons 
                                    name="apps" 
                                    size={28} 
                                    color={isSelected ? "#FFFFFF" : "#00685C"} 
                                />
                            </View>
                        )}
                    </View>
                    {/* Category Name */}
                    {isCompact ? (
                        <View style={styles.compactTextContainer}>
                            <Text 
                                style={[
                                    styles.categoryText,
                                    isSelected && styles.selectedCategoryText,
                                    styles.categoryTextShadow,
                                    { fontSize: 13 }
                                ]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item?.name}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.textContainer}>
                            <Text 
                                style={[
                                    styles.categoryText,
                                    isSelected && styles.selectedCategoryText,
                                    styles.categoryTextShadow
                                ]}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {item?.name}
                            </Text>
                        </View>
                    )}
                    {/* Selection Indicator */}
                    {isSelected && (
                        <Animated.View
                            style={[
                                styles.selectionIndicator,
                                {
                                    opacity: opacityAnim,
                                },
                            ]}
                        />
                    )}
                </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 6,
        marginVertical: 4,
    },
    categoryContainer: {
        width: 100,
        height: 110,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    gradientBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    imageWrapper: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    coverImage: { 
        height: 50,
        width: 80,
        borderRadius: 12,
    },
    allIconContainer: {
        height: 50,
        width: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 104, 92, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 104, 92, 0.2)',
    },
    selectedIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: "#374151",
        textAlign: 'center',
        lineHeight: 16,
    },
    selectedCategoryText: {
        color: "#FFFFFF",
        fontWeight: '700',
    },
    selectionIndicator: {
        position: 'absolute',
        bottom: -8,
        width: 20,
        height: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    imageGradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 12,
    },
    categoryTextShadow: {
        textShadowColor: 'rgba(0,0,0,0.18)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    compactTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 16,
        paddingHorizontal: 8,
    },
});

//make this component available to the app
export default CategoryCardView;
