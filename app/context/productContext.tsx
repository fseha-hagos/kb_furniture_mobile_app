import { REVIEW_DATA } from '@/constants/configurations';
import { db } from '@/firebaseConfig';

import { productsType, reviewsType } from '@/types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Review extends reviewsType {
  userName: string;
  images?: string[];
}

interface ProductContextType {
  reviews: Review[];
  favorites: string[];
  recentlyViewed: productsType[];
  addReview: (review: Omit<Review, 'reviewId' | 'createdAt'>) => Promise<void>;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addToRecentlyViewed: (product: productsType) => void;
  getProductReviews: (productId: string) => Promise<Review[]>;
  getAverageRating: (productId: string) => Promise<number>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<productsType[]>([]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [favoritesData, recentlyViewedData] = await Promise.all([
          AsyncStorage.getItem('favorites'),
          AsyncStorage.getItem('recentlyViewed'),
        ]);

        if (favoritesData) {
          try {
            setFavorites(JSON.parse(favoritesData));
          } catch (e) {
            console.error('Error parsing favorites data:', e);
            setFavorites([]);
          }
        }
        if (recentlyViewedData) {
          try {
            const parsedData = JSON.parse(recentlyViewedData);
            setRecentlyViewed(Array.isArray(parsedData) ? parsedData : []);
          } catch (e) {
            console.error('Error parsing recently viewed data:', e);
            setRecentlyViewed([]);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setFavorites([]);
        setRecentlyViewed([]);
      }
    };

    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem('favorites', JSON.stringify(favorites)),
          AsyncStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed)),
        ]);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [favorites, recentlyViewed]);

  const addReview = async (review: Omit<Review, 'reviewId' | 'createdAt'>) => {
    try {
      const reviewsRef = collection(db, `${REVIEW_DATA}`);
      const newReview = {
        ...review,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(reviewsRef, newReview);
      const addedReview: Review = {
        ...newReview,
        reviewId: docRef.id,
        createdAt: new Date().toISOString(),
      };
      
      setReviews(prev => [...prev, addedReview]);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const getProductReviews = async (productId: string): Promise<Review[]> => {
    try {
      const reviewsRef = collection(db, `${REVIEW_DATA}`);
      const q = query(
        reviewsRef,
        where('productId', '==', productId)
      );
      
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          ...data,
          reviewId: doc.id,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        } as Review);
      });
      
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setReviews(reviews);
      return reviews;
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  };

  const getAverageRating = async (productId: string): Promise<number> => {
    try {
      const productReviews = await getProductReviews(productId);
      if (productReviews.length === 0) return 0;
      const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / productReviews.length;
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  };

  const addToFavorites = (productId: string) => {
    setFavorites(prev => [...prev, productId]);
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const addToRecentlyViewed = (product: productsType) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.productId !== product.productId);
      return [product, ...filtered].slice(0, 10); // Keep only last 10 items
    });
  };

  return (
    <ProductContext.Provider
      value={{
        reviews,
        favorites,
        recentlyViewed,
        addReview,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToRecentlyViewed,
        getProductReviews,
        getAverageRating,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}; 