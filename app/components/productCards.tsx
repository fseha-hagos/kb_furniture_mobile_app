//import liraries
import { productsType } from '@/types/type';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/cartContext';


interface props {
    item : productsType,
  }
 
const ProductCards = ({ item }: props) => {
   
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const {handleLiked, likedProducts} = useAuth();
    const itemToSend = {
        ...item,
        // Already contains `%2F`, DO NOT decode it
      };
    
    // Animation values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const likeScaleAnim = useRef(new Animated.Value(1)).current;
    
   
   useEffect(() => {
    const isLiked = likedProducts?.some((liked) => liked.productId === item.productId);
     if (isLiked) {
        setIsLiked(true)
    }else{
        setIsLiked(false)
    }
   },[handleLiked])



   const handlePressIn = () => {
     setIsPressed(true);
     Animated.spring(scaleAnim, {
       toValue: 0.95,
       tension: 100,
       friction: 8,
       useNativeDriver: true,
     }).start();
   };

   const handlePressOut = () => {
     setIsPressed(false);
     Animated.spring(scaleAnim, {
       toValue: 1,
       tension: 100,
       friction: 8,
       useNativeDriver: true,
     }).start();
   };

   const handleLikePress = () => {
     Animated.sequence([
       Animated.timing(likeScaleAnim, {
         toValue: 1.3,
         duration: 150,
         useNativeDriver: true,
       }),
       Animated.spring(likeScaleAnim, {
         toValue: 1,
         tension: 100,
         friction: 8,
         useNativeDriver: true,
       }),
     ]).start();
     handleLiked!(item);
   };

    return (
         <Animated.View
           style={[
             styles.container,
             {
               transform: [
                 { scale: scaleAnim },
               ],
             },
           ]}
         >
           <TouchableOpacity  
             style={styles.cardContainer}
             onPress={() => router.push({pathname: "/product", params:{"productData": encodeURIComponent(JSON.stringify(itemToSend))} })}
             onPressIn={handlePressIn}
             onPressOut={handlePressOut}
             activeOpacity={0.9}
           > 
             <View style={styles.proImageContainer}>
               <Image
                 source={{uri: item.images[0]}} 
                 style={styles.proCoverImage}
                 contentFit='cover'
                  priority="high"
                  cachePolicy="memory-disk"
                  transition={300} // Optional smooth fade
                  placeholder={require("@/assets/logo/kb-furniture-high-resolution-logo-transparent.png")}
                  onError={(error) => console.log('Image loading error:', error)}
                 onLoad={() => console.log('Image loaded successfully')}
                /> 
               <LinearGradient
                 colors={['transparent', 'rgba(0,0,0,0.3)']}
                 style={styles.imageOverlay}
               />
             </View>
             
             <View style={styles.content}>
               <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
               
               {/* Product Description */}
               <Text style={styles.description} numberOfLines={1}>
                 {item.description}
               </Text>
               
              
               
               <View style={styles.priceContainer}>
                 <Text style={styles.price}>Birr {item.price}</Text>
                 <View style={styles.ratingContainer}>
                   <Ionicons name="star" size={12} color="#FFD700" />
                   <Text style={styles.rating}>4.5</Text>
                 </View>
               </View>
             </View>
             
             <Animated.View style={[styles.likeContainer, { transform: [{ scale: likeScaleAnim }] }]}>
               <TouchableOpacity 
                 onPress={handleLikePress}
                 style={styles.likeButton}
                 activeOpacity={0.8}
               >
                 {isLiked ? (
                   <LinearGradient
                     colors={['#FF6B6B', '#FF8E8E']}
                     style={styles.likeGradient}
                   >
                     <FontAwesome name="heart" size={18} color="white" />
                   </LinearGradient>
                 ) : (
                   <View style={styles.likeButtonOutline}>
                     <Entypo name="heart-outlined" size={20} color="#666" />
                   </View>
                 )}
               </TouchableOpacity>
             </Animated.View>
           </TouchableOpacity>
         </Animated.View>
            
        
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
       flex: 1,
       margin: 6,
       borderRadius: 8,
       elevation: 8,
       shadowColor: '#000',
       shadowOffset: {
         width: 0,
         height: 4,
       },
       shadowOpacity: 0.15,
       shadowRadius: 8,
       backgroundColor: '#FFFFFF',
    },
    cardContainer: {
       flex: 1,
       borderRadius: 8,
       overflow: 'hidden',
       backgroundColor: '#FFFFFF',
    },
    proImageContainer: {
       position: 'relative',
       height: 200,
    },
    proCoverImage: { 
        height: 200,    
        width: '100%',
        borderRadius: 8,
    },
    imageOverlay: {
       position: 'absolute',
       bottom: 0,
       left: 0,
       right: 0,
       height: 60,
       borderRadius: 8,
    },
    content: {
        padding: 12,
        paddingTop: 8,
    },
    title: {
        fontSize: 12,
        color: "#1A1A1A",
        fontWeight: "600",
        lineHeight: 14,
        marginBottom: 4,
    },
    priceContainer: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
    },
    price: {
        fontSize: 14,
        color: "#00685C",
        fontWeight: "700",
    },
    ratingContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       gap: 4,
    },
    rating: {
       fontSize: 12,
       color: "#666666",
       fontWeight: "500",
    },
    likeContainer: {
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 10,
    },
    likeButton: {
       width: 36,
       height: 36,
       borderRadius: 18,
       justifyContent: "center",
       alignItems: "center",
    },
    likeGradient: {
       width: 36,
       height: 36,
       borderRadius: 18,
       justifyContent: "center",
       alignItems: "center",
       elevation: 4,
       shadowColor: '#FF6B6B',
       shadowOffset: {
         width: 0,
         height: 2,
       },
       shadowOpacity: 0.3,
       shadowRadius: 4,
    },
    likeButtonOutline: {
       width: 36,
       height: 36,
       borderRadius: 18,
       backgroundColor: 'rgba(255, 255, 255, 0.9)',
       justifyContent: "center",
       alignItems: "center",
       borderWidth: 1,
       borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    description: {
      fontSize: 11,
      color: "#666",
      marginBottom: 4,
      lineHeight: 13,
    },
    detailsContainer: {
      marginBottom: 6,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    detailLabel: {
      fontSize: 11,
      color: "#888",
      fontWeight: "500",
      marginRight: 4,
    },
    detailValue: {
      fontSize: 11,
      color: "#333",
      fontWeight: "400",
    },
});

//make this component available to the app
export default ProductCards;
