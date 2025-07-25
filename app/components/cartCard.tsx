//import liraries
import { cartType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// create a component


  

interface prop {
    item: cartType,
    deleteFromCart: any;
}

const CartCard = ({item, deleteFromCart}: prop) => {
    // const navigation = useNavigation<NavigationProp<ProductStackParamList>>();
    const router = useRouter();

    const handleCheckout = () => {
        const productData = {
            ...item.product
        };
        router.push({
            pathname: "/product",
            params: {
                productData: encodeURIComponent(JSON.stringify(productData))
            }
        });
    };

    return (
        <View style={styles.container}>
            <Image source={{uri: item.product.images[0]}} style={styles.coverImage}/>
            <View style={styles.cartContent}>
                <Text style={styles.title}>{item.product.title}</Text>
                <Text style={styles.price}>Birr {item.product.price}</Text>
            <View style={styles.circleSizeContainer}>
            <View style={[styles.circle, {backgroundColor: item.selectedColor === null ? '"#7094C1"' : item.selectedColor}]} /> 
                
                
                <Text style={styles.quantityContainer}> +{item.quantity} </Text>
            </View>
            </View>
            <View style={{alignItems: 'center', gap: 15}}>
                <TouchableOpacity onPress={() => {deleteFromCart(item.product)}}>

                <Ionicons name='trash-outline' size={24} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCheckout}>
                    <Text style={styles.checkoutText}>checkout</Text>
                </TouchableOpacity>
            </View>
           
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal:5

    },
    coverImage: {
        width: "40%",
        height:100,
        borderRadius: 10
    },
    checkoutText : {
        backgroundColor: 'black', 
        color: 'white', 
        padding:2,
        paddingHorizontal: 8, 
        borderRadius: 5, 
        textAlign: 'center'
    },
    cartContent: {
        flex: 1,
        marginHorizontal: 7
    },
    title: {
        color: "#444444",
        fontSize: 17
    },
    price: {
        color: "#797979",
    },
    circle: {
        width: 25,
        height: 25,
        borderRadius: 20,
        backgroundColor: "#7094C1"
    },
    circleSizeContainer: {
        marginVertical: 5,
        flexDirection: "row"
    },
    quantityContainer : {
       
        height: 25,
        marginHorizontal: 7,
        fontWeight: "500",
        fontSize: 17
    }
});


export default CartCard;
