//import liraries
import { cartType } from '@/types/type';
import { LanguageCode } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// create a component


  

interface prop {
    item: cartType,
    deleteFromCart: any;
    updateQuantity?: (item: any, quantity: number) => void;
}

const CartCard = ({item, deleteFromCart, updateQuantity}: prop) => {
    const { i18n, t } = useTranslation();
    const currentLang: LanguageCode = i18n.language as LanguageCode;

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
            <TouchableOpacity style={styles.coverImage} onPress={handleCheckout}>
               <Image source={{uri: item.product.images[0]}} style={{flex: 1, borderRadius: 10}}/>
            </TouchableOpacity>
            
            <View style={styles.cartContent}>
                <Text style={styles.title}>{item.product.name[currentLang]}</Text>
                <Text style={styles.price}>{t('birr')} {item.product.price}</Text>
            <View style={styles.circleSizeContainer}>
                <View style={[styles.circle, {backgroundColor: item.selectedColor === null ? '"#7094C1"' : item.selectedColor}]} /> 
                
                <View style={styles.quantityControls}>
                    <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity && updateQuantity(item.product, (item.quantity || 1) - 1)}
                    >
                        <Ionicons name="remove" size={16} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                    <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity && updateQuantity(item.product, (item.quantity || 1) + 1)}
                    >
                        <Ionicons name="add" size={16} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>
            </View>
            <View style={{alignItems: 'center', gap: 15}}>
                <TouchableOpacity onPress={() => {deleteFromCart(item.product)}}>
                 <Ionicons name='trash-outline' size={24} color="black"/>
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
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        minWidth: 30,
        textAlign: 'center',
    }
});


export default CartCard;
