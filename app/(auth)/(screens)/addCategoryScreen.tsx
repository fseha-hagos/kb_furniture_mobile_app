import Navbar from '@/app/components/navbar';
import { RequireAdmin } from '@/app/components/RequireAdmin';
import { CATEGORY_DATA } from '@/constants/configurations';
import { db, storage } from '@/firebaseConfig';
import { categoriesType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import NetworkError from '../../components/NetworkError';
import { useUserRole } from '../../hooks/useUserRole';

const AddCategoryContent = () => {
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [parentId, setParentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categoryList, setCategoryList] = useState<categoriesType[]>([]);
  const [showParentModal, setShowParentModal] = useState(false);
  const [selectedParentName, setSelectedParentName] = useState('');
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { role } = useUserRole();

  // Generate unique category ID
  const generateCategoryId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `cat_${timestamp}_${random}`;
  };

  useEffect(() => {
    // Generate category ID on component mount
    setCategoryId(generateCategoryId());
    // Fetch existing categories for parent selection
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
        setImage(result.assets[0].uri);
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


  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Please select an image for the category');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const imageUrl = await uploadImage(image, categoryId);
      const categoryData = {
        categoryId: categoryId,
        name: name.trim(),
        image: imageUrl,
        parentId: parentId || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, CATEGORY_DATA), categoryData);
      
      setSuccess(true);
      // Reset form
      setCategoryId(generateCategoryId());
      setName('');
      setImage('');
      setParentId('');
      setSelectedParentName('');
      
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

  const selectParentCategory = (category: categoriesType) => {
    setParentId(category.categoryId);
    setSelectedParentName(category.name);
    setShowParentModal(false);
  };

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
          value={categoryId}
          editable={false}
          placeholder="Auto-generated"
        />
      </View>

      {/* Category Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Image Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Image *</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#00685C" />
              <Text style={styles.imagePlaceholderText}>Select Image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Parent Category Selection */}
      <View style={styles.inputContainer}>
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
      </View>

      {/* Submit Button */}
      {role === 'admin' && (
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Category</Text>}
        </TouchableOpacity>
      )}

      

      {/* Parent Category Modal */}
      <Modal
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
      </Modal>
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
});


