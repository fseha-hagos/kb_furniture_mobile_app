//import liraries
import { db } from '@/firebaseConfig';
import { DocumentData, collection, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Navbar from '../../components/navbar';
import ProductCards from '../../components/productCards';
// import { myProductsFromDatabasePeopsWithId } from '../../context/constants';
import { Ionicons } from '@expo/vector-icons';
import DataFetchError from '../../components/DataFetchError';
import { handleFirebaseError } from '../../utils/firebaseErrorHandler';

// create a component
const ItemList = ({ route }: any) => {

    const pageSize = 4;

    //const {params} =  useRoute();
   
    const [refreshing, setRefreshing] = useState(true);
    const [startingDoc, setStartingDoc] = useState<DocumentData | null>(null);
    const [previosStart, setPreviosStart] = useState<DocumentData | null>(null);
    const [latestCatagoryItemList, setLatestCatagoryItemlist] = useState<DocumentData[]>([]);
    const [isOffline, setIsOffline] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const catagoryName:string = route.params?.item;

    useEffect(()=>{
        console.log(catagoryName)
        route && getLatestItems();
    }
    ,[route])

    const getItemListByCatagory = async () => {
        //const querySnapshots = await getDocs(query(collection(db, 'FurnitureData'), where("values.catagory", "==",catagoryName)));
        const q = query(collection(db,"FurnitureData"), where("values.catagory", "==",catagoryName))
        const querySnapshots = await getDocs(q);
        querySnapshots.forEach((doc) => {
            setLatestCatagoryItemlist(latestCatagoryItemList => [...latestCatagoryItemList, doc.data()])
            setRefreshing(false);
        })
        setRefreshing(false);
       
    }

    const getLatestItems = async() => {
        try {
            setError(null);
            setIsOffline(false);
            const q = query(collection(db, 'FurnitureData'), where("values.catagory", "==",catagoryName), limit(pageSize));
            const querySnapshot = await getDocs(q);

            setRefreshing(true);
            setLatestCatagoryItemlist([]);

            querySnapshot.forEach((doc) => {
                doc.data().values.id = doc.id;
                const productWithId = doc.data();
                productWithId.values.id = doc.id;
                setLatestCatagoryItemlist(latestCatagoryItemList => [...latestCatagoryItemList, productWithId]);
            });
            
            setPreviosStart(querySnapshot.docs[(querySnapshot.docs.length - 1)-querySnapshot.docs.length]);
            setStartingDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            const result = await handleFirebaseError(error, {
                enableAppReload: true,
                showAlert: true
            });
            
            if (!result.success && !result.shouldReload) {
                setIsOffline(true);
                setError("An error occurred while fetching data. Please try again.");
            }
        } finally {
            setRefreshing(false);
        }
    }

    const handleLoadMore = async (side: number) => {
        try {
            setError(null);
            setIsOffline(false);
            let nextSnapshot:DocumentData | undefined = undefined;
            
            setRefreshing(true);
            if(side===1){
                if (!previosStart){
                    getLatestItems();
                    return;
                }
                setLatestCatagoryItemlist([]);
                const prevQuery = query(
                    collection(db, 'FurnitureData'),
                    where("values.catagory", "==",catagoryName),
                    startAfter(previosStart),
                    limit(pageSize)
                )
                nextSnapshot = await getDocs(prevQuery);
            } else {
                if (!startingDoc){
                    getLatestItems();
                    return;
                } 
                
                setLatestCatagoryItemlist([]);
                let nextQuery = query(
                    collection(db, 'FurnitureData'),
                    where("values.catagory", "==",catagoryName),
                    startAfter(startingDoc),
                    limit(pageSize)
                );
                nextSnapshot = await getDocs(nextQuery);
                if(nextSnapshot.size === 0){
                    getLatestItems();
                    return;
                } 
            }

            nextSnapshot.forEach((doc:DocumentData) => {
                doc.data().values.id = doc.id;
                const productWithId = doc.data();
                productWithId.values.id = doc.id;
                setLatestCatagoryItemlist(latestCatagoryItemList => [...latestCatagoryItemList, productWithId]);
            });
            
            setPreviosStart(nextSnapshot.docs[(nextSnapshot.docs.length - 1)-nextSnapshot.docs.length]);
            setStartingDoc(nextSnapshot.docs[nextSnapshot.docs.length - 1]);
        } catch (error) {
            const result = await handleFirebaseError(error, {
                enableAppReload: true,
                showAlert: true
            });
            
            if (!result.success && !result.shouldReload) {
                setIsOffline(true);
                setError("An error occurred while fetching data. Please try again.");
            }
        } finally {
            setRefreshing(false);
        }
    };

    // function handleLiked(items: myProductsFromDatabasePeopsWithId): void {
    //     throw new Error('Function not implemented.');
    // }

    if (error || isOffline) {
        return (
            <View style={styles.container}>
                <Navbar title={catagoryName} showSearch={false} showBack={true} />
                <DataFetchError
                    message={isOffline ? "No internet connection. Please check your connection and try again." : error || "No data found. Please try again."}
                    onRetry={getLatestItems}
                    loading={refreshing}
                    icon={isOffline ? "wifi-off-outline" : "cloud-offline-outline"}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Navbar title={catagoryName} showSearch={false} showBack={true} />

            {refreshing ? 
                (<View style={styles.contentConteiner}>
                    <ActivityIndicator size={'large'} color={"gray"} style={{marginTop:30}}/> 
                </View>)
            :
                (latestCatagoryItemList.length > 0 ?
                    <View style={{flex:1, paddingBottom: 50}}>
                        <FlatList 
                            numColumns={2}
                            data={latestCatagoryItemList} 
                            renderItem={({item ,index}) => (
                                <ProductCards
                                    item={item.values}
                                />
                            )} 
                            keyExtractor={item => item.values.id}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={getLatestItems} />
                            }
                        />  
                        <View style={styles.scrollInnerContainer}>
                            <View style={styles.paginationContainer}>
                                <TouchableOpacity 
                                    style={[styles.pagination, isOffline && styles.disabledButton]} 
                                    onPress={() => handleLoadMore(1)}
                                    disabled={isOffline}
                                >
                                    <Ionicons name="chevron-back-outline" size={24} color="#00685C" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.pagination, isOffline && styles.disabledButton]} 
                                    onPress={() => handleLoadMore(2)}
                                    disabled={isOffline}
                                >
                                    <Ionicons name="chevron-forward" size={24} color="#00685C" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                : 
                <View style={styles.contentConteiner}>
                    <Text style={styles.notFoundText}>No products found in this category.</Text>
                </View>
                )
            }
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%'
    },
    contentConteiner: {
        flex: 1,
        alignItems: "center",
        marginTop: 150
    },
    notFoundText : {
        fontSize: 20
    },
    scrollInnerContainer: {
        bottom:0,
      },
      paginationContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        marginVertical: 15,
    
      },
      pagination: {
        display: "flex",
        flexDirection: "row",
        borderRadius: 10,
        padding:3,
        width: 60,
        borderWidth: 2,
        borderColor: "#00685C",
        backgroundColor: "white",
    
        alignItems: "center",
        justifyContent: "center"
      },
      errorContainer: {
        padding: 16,
        backgroundColor: '#ffebee',
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    errorText: {
        color: '#c62828',
        marginBottom: 8,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#00685C',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    retryText: {
        color: 'white',
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.5,
    },
});

//make this component available to the app
export default ItemList;
