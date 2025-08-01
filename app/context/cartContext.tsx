import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
// import {myProductsFromDatabasePeopsWithId, myProductsFromDatabaseProps} from '../context/constants'
import { cartType, productsType } from '@/types/type';




interface AuthProps {
    totalPrice?: number,
    carts?: cartType[],
    onAddToCart?: (item: productsType, selectedColor: string) => Promise<void | any>;
    deleteFromCart?: (item: productsType) => Promise<void | any>;
    handleLiked?:  (item: productsType) => Promise<void | any>;
    refreshCart?: () => Promise<void | any>;
    likedProducts?: productsType[];
}

//const TOKEN_KEY = 'my-jwt';
//export const API_URL = 'https://api.developbetterapps.com';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any)=>{

    const [carts, setCarts] = useState<cartType[]>([])
    const [totalPrice, setTotalPrice] = useState(0);
    const [likedProducts, setLikedProducts] = useState<productsType[]>([])

    useEffect(() => {
       
        totalSum(carts);
        loadCartItems();
        loadLikedItems();
    },[totalPrice])

    const loadCartItems = async () => {
        let getCarts = await AsyncStorage.getItem("carts");
        let savedCarts = getCarts ? JSON.parse(getCarts) : [];
        setCarts(savedCarts)
        totalSum(savedCarts)
        console.log("getCarts : ",getCarts)
    }
    const loadLikedItems = async () => {
        let getLiked = await AsyncStorage.getItem("liked-products");
        let savedLikes = getLiked ? JSON.parse(getLiked) : [];
        setLikedProducts(savedLikes);
    }

    const totalSum = (carts: cartType[]) => {
        const totalSum = carts.reduce((accumulator, item) => accumulator + (Number(item.product.price)*Number(item.quantity)), 0);
        setTotalPrice(totalSum);
    }

    const handleLiked = async (items: productsType) => { 
         
         const isLiked = likedProducts.some((liked) => liked.productId === items.productId);
         
         if (isLiked) {
            const newItems = likedProducts.filter((liked) => liked.productId !== items.productId) ;
            setLikedProducts(newItems);
            await AsyncStorage.setItem("liked-products", JSON.stringify(newItems));
          } else {
            const dislike =  [...likedProducts, items]
            setLikedProducts(dislike);
            await AsyncStorage.setItem("liked-products", JSON.stringify(dislike));
          }      
          console.log("context liked products: ",likedProducts)
          return Promise.resolve();
      }
   
     
    const deleteFromCart = async (item: productsType) => {
        const newItems = carts.filter((cart) => cart.product.productId !== item.productId) ;
        await AsyncStorage.setItem("carts", JSON.stringify(newItems));
        setCarts(newItems)
        totalSum(newItems);
    }
    const refreshCart = async () => {
        loadCartItems();
        loadLikedItems();
    }

    const addToCart = async (item: productsType, selectedColor: string) => {
        try {
            const itemExists = carts.findIndex(
                (cart) => cart.product.productId === item.productId && cart.selectedColor === selectedColor
            );

            if (itemExists !== -1) {
                // Item exists with the same color, do nothing
                return;
            } else {
                // Item doesn't exist or has different color, add as new order
                const updatedCarts = [...carts, { product: item, quantity: 1, selectedColor: selectedColor }];
                setCarts(updatedCarts);
                totalSum(updatedCarts);
                await AsyncStorage.setItem("carts", JSON.stringify(updatedCarts));
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const value = {
        totalPrice,
        carts,
        onAddToCart: addToCart,
        deleteFromCart,
        likedProducts,
        handleLiked,
        refreshCart,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthProvider;


