import Navbar from '@/app/components/navbar';
import { RequireAdmin } from '@/app/components/RequireAdmin';
import { handleFirebaseError } from '@/app/utils/firebaseErrorHandler';
import { CATEGORY_DATA } from '@/constants/configurations';
import { db, storage } from '@/firebaseConfig';
import { categoriesType } from '@/types/type';
import { LanguageCode } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { collection, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import NetworkError from '../../components/NetworkError';
import { useUserRole } from '../../hooks/useUserRole';

const AddCategoryContent = () => {

  const { i18n, t } = useTranslation();
  const currentLang: LanguageCode = i18n.language as LanguageCode;

  // const [categoryId, setCategoryId] = useState('');
  // const [name, setName] = useState('');
  // const [image, setImage] = useState('');
  // const [parentId, setParentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categoryList, setCategoryList] = useState<categoriesType[]>([]);
  const [showParentModal, setShowParentModal] = useState(false);
  const [selectedParentName, setSelectedParentName] = useState('');
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { role } = useUserRole();
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [category, setCategory] = useState<categoriesType>({
    categoryId: "",
    name: { en: "", am: "" },
    subcategories: [],
    image: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load categories
        setIsCategoryLoading(true);
        await getCategoryList();

      } catch (error) {
        handleFirestoreError(error);
      }
    };
    
    loadInitialData();
  }, []);


  const getCategoryList = async() => {
    try {
      setCategoryList([]);
      await fetchWithRetry(async () => {
        const querySnapShot = await getDocs(collection(db, `${CATEGORY_DATA}`));
        querySnapShot.forEach((doc) => {
          setCategoryList(categoryList => [...categoryList, doc.data() as categoriesType]);
        });
      });
    } catch (error) {
      handleFirestoreError(error);
    } finally {
      setIsCategoryLoading(false);
    }
  };


  // Add a generic retry helper at the top, after imports
  const fetchWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 1500) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(fn, retries - 1, delay * 2); // Exponential backoff
      } else {
        throw error;
      }
    }
  };


  const handleFirestoreError = async (error: any) => {
    console.error("Firestore error:", error);
    
    const result = await handleFirebaseError(error, {
      enableAppReload: true,
      showAlert: true
    });
    
    if (result.success) {
      // Retry was successful, reset error states
      setIsOffline(false);
      setError(null);
      return;
    }
    
    if (result.shouldReload) {
      // App will reload automatically, no need to set error states
      return;
    }
    
    // For other errors, show the offline state
    setIsOffline(true);
    setError("An error occurred while fetching data. Please check your internet connection and try again.");
  };

  // Generate unique category ID
  const generateCategoryId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `cat_${timestamp}_${random}`;
  };

  

  useEffect(() => {
    // Generate category ID on component mount
    setCategory(prev => ({ ...prev, categoryId: generateCategoryId()}));
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, CATEGORY_DATA));
      const categories = querySnapshot.docs.map(doc => doc.data() as categoriesType);
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCategory(prev => ({ ...prev, image: result.assets[0].uri}));
        // setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (imageUri: string, categoryId: string): Promise<string> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Create a unique filename for the image
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExtension = 'jpg'; // Default extension
      const uniqueFileName = `${categoryId}_${timestamp}_${randomString}.${fileExtension}`;
      
      // Create a storage reference with the category ID and unique filename
      const storageRef = ref(storage, `category_storage/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Number(progress.toFixed()));
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };


// these functionalities are newly added for specific modification
const updateEnglishName = (newName: string) => {
  setCategory(prev => ({
    ...prev,
    name: { ...prev.name, en: newName }
  }));
};

const updateAmharicName = (newName: string) => {
  setCategory(prev => ({
    ...prev,
    name: { ...prev.name, am: newName }
  }));
};

const addSubcategory = (id: string, en: string, am: string) => {
  setCategory(prev => ({
    ...prev,
    subcategories: [
      ...prev.subcategories,
      { id, name: { en, am } }
    ]
  }));
};

  const oldCategoryView = (categoryItem : categoriesType) => {
    return (
      <View style={styles.catContainer}>
          <TouchableOpacity 
              onPress={() => {setCategory(categoryItem); setIsEditing(true)}}
              style={[
                  styles.categoryContainer,
                  {
                      backgroundColor: '#FFFFFF',
                      borderColor: '#F0F0F0',
                  },
              ]}
              activeOpacity={0.7}
          >
              <View style={styles.catImageContainer}>
                          <View style={styles.imageWrapper}>
                              <Image
                                  
                                  source={{ uri: categoryItem.image }}
                                  style={styles.catCoverImage}
                                  cachePolicy="memory-disk"
                                  transition={300} // Optional smooth fade
                                  priority="high"
                                  placeholder={require("@/assets/logo/kb-furniture-high-resolution-logo-transparent.png")}
                                  onError={(error) => console.log('Category image error:', error)}
                                  onLoad={() => console.log('Category image loaded')}
                               
                                  />
                             
                          </View>
              </View>
              
              {/* Category Name */}
              <View style={styles.textContainer}>
                  <Text 
                      style={[
                          styles.categoryText,
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                  >
                      { categoryItem.name[currentLang]}
                  </Text>
              </View>
          </TouchableOpacity>
      </View>
  );
  }


  const handleAddNew = () => {
    setCategory({
      categoryId: generateCategoryId(),
      name: { en: "", am: "" },
      subcategories: [],
      image: "",
      createdAt: "",
      updatedAt: "",
    });

   setIsEditing(false);
  }

 

const handleEdit = async () => {
  if (!category.name["am"].trim() && !category.name["en"].trim()) {
    Alert.alert('Error', 'Please enter a category name');
    return;
  }

  if (!category.image) {
    Alert.alert('Error', 'Please select an image for the category');
    return;
  }

  if (!category.categoryId) {
    Alert.alert('Error', 'No category selected for editing');
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    // Upload image if it's a new file, otherwise keep old URL
    const imageUrl = category.image.startsWith("http")
      ? category.image
      : await uploadImage(category.image, category.categoryId);

    const categoryRef = doc(db, CATEGORY_DATA, category.categoryId);

    const categoryData = {
      ...category,
      name: { ...category.name },
      image: imageUrl,
      updatedAt: serverTimestamp(), // only update updatedAt
    };

    await updateDoc(categoryRef, categoryData);

    setSuccess(true);

    // Reset form
    setCategory({
      categoryId: "",
      name: { en: "", am: "" },
      subcategories: [],
      image: "",
      createdAt: "",
      updatedAt: "",
    });

    // Refresh category list
    await fetchCategories();
  } catch (e: any) {
    setError(e.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async () => {
    if (!category.name["am"].trim() && !category.name["en"].trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (!category.image) {
      Alert.alert('Error', 'Please select an image for the category');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const imageUrl = await uploadImage(category.image, category.categoryId);
      const categoryData = {
        ...category, // keep any other fields from state
        name: {
          ...category.name,
        },
        image: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, CATEGORY_DATA, category.categoryId), categoryData);
      // await addDoc(collection(db, CATEGORY_DATA), categoryData);
      
      setSuccess(true);
      // Reset form
      setCategory({
        categoryId: generateCategoryId(),
        name: { en: "", am: "" },
        subcategories: [],
        image: "",
        createdAt: "",
        updatedAt: "",
      });
    
      // Refresh category list
      await fetchCategories();
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setSuccess(false);
  };

  // const selectParentCategory = (category: categoriesType) => {
  //   setParentId(category.categoryId);
  //   setSelectedParentName(category.name);
  //   setShowParentModal(false);
  // };

  if (error) {
    return <NetworkError onRetry={handleRetry} message={error} />;
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        <Text style={styles.successText}>Category Added Successfully!</Text>
        <View style={styles.successButtonsContainer}>
          {role === 'admin' && (
            <TouchableOpacity style={styles.successButton} onPress={() => setSuccess(false)}>
              <Text style={styles.successButtonText}>Add Another</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.successButton, styles.homeButton]} onPress={() => router.push("/(auth)/(tabs)/home")}>
            <Text style={styles.successButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Navbar title="Add Category" showBack={true} showSearch={false} />

   
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* <Text style={styles.title}>Add Category</Text> */}
      
      {/* Category ID (Auto-generated, read-only) */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category ID</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={category.categoryId}
          editable={false}
          placeholder="Auto-generated"
        />
      </View>

      {/* Category Name English */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category English Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter English category name"
          value={category.name["en"]}
          onChangeText={(text) => updateEnglishName(text)}
        />
      </View>

      {/* Category Name Amharic*/}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Amharic Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Amharic category name"
          value={category.name["am"]}
          onChangeText={(text) => updateAmharicName(text)}
        />
      </View>

      {/* Image Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Image *</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          {category.image ? (
            <Image source={{ uri: category.image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#00685C" />
              <Text style={styles.imagePlaceholderText}>Select Image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Parent Category Selection */}
      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>Parent Category (Optional)</Text>
        <TouchableOpacity 
          style={styles.parentSelector} 
          onPress={() => setShowParentModal(true)}
        >
          <Text style={selectedParentName ? styles.parentText : styles.parentPlaceholder}>
            {selectedParentName || 'Select parent category'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#00685C" />
        </TouchableOpacity>
      </View> */}

      {/* Submit Button */}
      {role === 'admin' && (
        
          isEditing ?
           (
           <View style={{flexDirection:'row', justifyContent:"space-between"}}>
              <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled, {width: '35%'}]}
                  onPress={handleAddNew}
                  disabled={loading}
                >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add New</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled, , {width: '60%'}]}
                  onPress={handleEdit}
                  disabled={loading}
                >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Edit Category</Text>}
              </TouchableOpacity>
          </View>
          ) :
          (<TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Category</Text>}
          </TouchableOpacity>))

      }

        <FlatList 
            data={categoryList} 
            renderItem={({item,index}) =>(
            
              oldCategoryView(item)
                

            )} 
            keyExtractor={(item, index) => item.categoryId?.toString() || "cat-" + index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
      

      {/* Parent Category Modal */}
      {/* <Modal
        visible={showParentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowParentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Parent Category</Text>
              <TouchableOpacity onPress={() => setShowParentModal(false)}>
                <Ionicons name="close" size={24} color="#00685C" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={categoryList}
              keyExtractor={(item) => item.categoryId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => selectParentCategory(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.categoryItemImage} />
                  <Text style={styles.categoryItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No categories available</Text>
              }
            />
          </View>
        </View>
      </Modal> */}
    </ScrollView>
    </View>
  );
};


export default function AddCategoryScreen() {
  return (
    <RequireAdmin>
      <AddCategoryContent />
    </RequireAdmin>
  );
} 
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#00685C',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  imagePickerButton: {
    width: '100%',
    height: 120,
    borderWidth: 2,
    borderColor: '#00685C',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#00685C',
    fontWeight: '500',
  },
  parentSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  parentText: {
    fontSize: 16,
    color: '#333',
  },
  parentPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  button: {
    width: '100%',
    backgroundColor: '#00685C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  successText: {
    fontSize: 22,
    color: '#4CAF50',
    marginVertical: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  successButton: {
    backgroundColor: '#00685C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  homeButton: {
    backgroundColor: '#4CAF50',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00685C',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },

    catContainer: {
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


