//import liraries
import { categoriesType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface prop {
    item : categoriesType,
    selectedCategory: categoriesType | null,
    onSelect: (item: categoriesType)=> void,
}

// create a component
const CategoryCardView = ({ item, selectedCategory, onSelect}: prop) => {
    const isSelected = selectedCategory?.categoryId === item.categoryId;

    const handlePress = () => {
        onSelect(item);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={handlePress}
                style={[
                    styles.categoryContainer,
                    {
                        backgroundColor: isSelected ? '#FF4747' : '#FFFFFF',
                        borderColor: isSelected ? '#FF4747' : '#F0F0F0',
                    },
                ]}
                activeOpacity={0.7}
            >
                <View style={styles.catImageContainer}>
                                            {item.categoryId !== 'all' ? (
                            <View style={styles.imageWrapper}>
                                <Image
                                    
                                    source={{ uri: item.image }}
                                    style={styles.catCoverImage}
                                    cachePolicy="memory-disk"
                                    transition={300} // Optional smooth fade
                                    priority="high"
                                    placeholder={require("@/assets/logo/kb-furniture-high-resolution-logo-transparent.png")}
                                    onError={(error) => console.log('Category image error:', error)}
                                    onLoad={() => console.log('Category image loaded')}
                                 
                                    />
                                {/* <Image
                                    source={{uri: item.image}} 
                                    style={styles.catCoverImage}
                                    // resizeMode="cover"
                                    // onError={(error) => console.log('Category image error:', error)}
                                    // onLoad={() => console.log('Category image loaded')}
                                /> */}
                            </View>
                    ) : (
                        <View style={[
                            styles.allIconContainer,
                            isSelected && styles.selectedIconContainer
                        ]}>
                            <Ionicons 
                                name="apps" 
                                size={24} 
                                color={isSelected ? "#FFFFFF" : "#666666"} 
                            />
                        </View>
                    )}
                </View>
                
                {/* Category Name */}
                <View style={styles.textContainer}>
                    <Text 
                        style={[
                            styles.categoryText,
                            isSelected && styles.selectedCategoryText,
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.name}
                    </Text>
                </View>

                {/* Selection Indicator */}
                {isSelected && (
                    <View style={styles.selectionIndicator} />
                )}
            </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 4,
        marginVertical: 6,
    },
    categoryContainer: {
        width: 85,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    catImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    imageWrapper: {
        borderRadius: 6,
        overflow: 'hidden',
    },
    catCoverImage: { 
        height: 40,
        width: 60,
        borderRadius: 6,
    },
    allIconContainer: {
        height: 40,
        width: 40,
        borderRadius: 6,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: "#333333",
        textAlign: 'center',
        lineHeight: 14,
    },
    selectedCategoryText: {
        color: "#FFFFFF",
        fontWeight: '600',
    },
    selectionIndicator: {
        position: 'absolute',
        bottom: -2,
        width: 16,
        height: 2,
        backgroundColor: '#FF4747',
        borderRadius: 1,
    },
});

//make this component available to the app
export default CategoryCardView;
