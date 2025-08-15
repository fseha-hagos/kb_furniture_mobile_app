//import liraries
import { db, storage } from '@/firebaseConfig';
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import Navbar from '@/app/components/navbar';
import { RequireAdmin } from '@/app/components/RequireAdmin';
import { categoriesType, PRODUCT_COLORS, productsType } from '@/types/type';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { useUserRole } from '../../hooks/useUserRole';


interface myErrorProps {
  name?: string; // Initialize with an empty string if a default value is needed
  // ... other properties
}

interface ImageFileProps {
  uri: string;
  width: number;
  height: number;
  type: "image" | "video" | "livePhoto" | "pairedVideo" | undefined;
  fileName?: string | null;
  fileSize?: number;
}

interface Variant {
  name: string;
  price: string;
  stock: number;
}

interface FormValuesType {
  name: {
    "en": string,
    "am": string
  },
  description: {
    "en": string,
    "am": string
  },
  price: number,
  categoryId: string,
  subCategoryId: string,
  images: string[],
  colors: string[];
  variants: {
      name: string;
      price: number;
      stock: number;
    }[],
}

const initialValues: FormValuesType = {
  name: { en: "", am: "" },
  description: { en: "", am: "" },
  price: 0,
  categoryId: "",
  subCategoryId: "",
  images: [],
  colors: [],
  variants: [],
};


const validationSchema = Yup.object().shape({
  name: Yup.object().shape({
    en: Yup.string().required('English name is required'),
    am: Yup.string().required('Amharic name is required'),
  }),
  description: Yup.object().shape({
    en: Yup.string().required('English Description is required'),
    am: Yup.string().required('Amharic Description is required'),
  }),
  price: Yup.number().typeError('Price must be a number').required('Price is required'),
  categoryId: Yup.string().required('Select category'),
  colors: Yup.array().min(1, 'Select at least one color'),
  variants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Variant name is required'),
      price: Yup.number().typeError('Price must be a number').required('Variant price is required'),
      stock: Yup.number().required('Stock is required').min(0, 'Stock cannot be negative')
    })
  )
});

// const validationSchema = Yup.object().shape({
//   nameEn: Yup.string().required('english name is required'),
//   nameAm: Yup.string().required('amharic name is required'),
//   descriptionEn: Yup.string().required('English Description is required'),
//   descriptionAm: Yup.string().required('Amharic Description is required'),
//   price: Yup.string().required('Price is required'),
//   categoryId: Yup.string().required('Select category'),
//   colors: Yup.array().min(1, 'Select at least one color'),
  
//   variants: Yup.array().of(
//     Yup.object().shape({
//       name: Yup.string().required('Variant name is required'),
//       price: Yup.string().required('Variant price is required'),
//       stock: Yup.number().required('Stock is required').min(0, 'Stock cannot be negative')
//     })
//   )
// });

// create a component
const AddPostContent = () => {

  const tempLanguage = "en";

  const [selectedImageFiles, setSelectedImageFiles] = useState<ImageFileProps[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<categoriesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const formikRef = React.useRef<any>(null);
  // const [name, setName] = useState('');
  // const navigation = useNavigation();
  const router = useRouter();
  const { role } = useUserRole();

  const [product, setProduct] = useState<productsType>({
    productId: "",
    name: { en: "", am: "" },
    description: { en: "", am: "" },
    price: 0,
    stock: 0,
    categoryId: "",
    subCategoryId: "",
    images: [],
    colors: [],
    variants: [],
    createdAt: "",
    updatedAt: ""
  });


  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async() => {
    try {
      const querySnapShot = await getDocs(collection(db, "category_data"));
      const categories = querySnapShot.docs.map(doc => doc.data() as categoriesType);
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      ToastAndroid.show("Failed to load categories", ToastAndroid.SHORT);
    }
  };

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Permission to access media library is required", ToastAndroid.LONG);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const selectedImages: ImageFileProps[] = result.assets.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        }));
        setSelectedImageFiles((prev) => [...prev, ...selectedImages]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      ToastAndroid.show("Failed to pick images", ToastAndroid.SHORT);
    }
  };

  const removeImage = (imageFile: ImageFileProps) => {
    setSelectedImageFiles(selectedImageFiles.filter(image => image !== imageFile));
  };

  // Generate a unique product ID
  const generateProductId = () => {
    return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const uploadImages = async (selectedImages: ImageFileProps[], productId: string): Promise<string[]> => {
    try {
      const uploadPromises = selectedImages.map(async (image, index) => {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        
        // Create a unique filename for each image
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileExtension = image.fileName?.split('.').pop() || 'jpg';
        const uniqueFileName = `${productId}_${timestamp}_${randomString}.${fileExtension}`;
        
        // Create a storage reference with the product ID and unique filename
        const storageRef = ref(storage, `products_storage/${productId}/images/${uniqueFileName}`);
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
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImageUrls(urls); // Store the uploaded URLs
      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const resetForm = () => {
    setSelectedImageFiles([]);
    setUploadedImageUrls([]);
    setProgress(0);
    // Reset form values
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };


  ///////////////////////////////////////////////////
  // these functionalities are newly added
  const updateProductNameEn = (newName: string) => {
    setProduct(prev => ({
      ...prev,
      name: { ...prev.name, en: newName }
    }));
  };

  const updateProductNameAm = (newName: string) => {
    setProduct(prev => ({
      ...prev,
      name: { ...prev.name, am: newName }
    }));
  };

  const updateProductPrice = (newPrice: string) => {
    setProduct(prev => ({
      ...prev,
      price: parseFloat(newPrice)
    }));
  };

  const updateProductCategory = (newCategoryId: string) => {
    setProduct(prev => ({
      ...prev,
      categoryId: newCategoryId
    }));
  };
  const updateProductColor = (newColors: string[]) => {
    setProduct(prev => ({
      ...prev,
      colors: newColors
    }));
  };

  const updateProductDescriptionEn = (newDescription: string) => {
    setProduct(prev => ({
      ...prev,
      description: { ...prev.description, en: newDescription }
    }));
  };

  const updateProductDescriptionAm = (newDescription: string) => {
    setProduct(prev => ({
      ...prev,
      description: { ...prev.description, am: newDescription }
    }));
  };

  const addVariant = (variant: { name: string; price: number; stock: number }) => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, variant]
    }));
  };
/////////////////////////////////////////////////

  const handleSubmit = async (product: productsType) => {
    console.log("this is selected product list:")
    // console.log("product :", product)
    try {
      // Check if there are selected images
      if (selectedImageFiles.length === 0) {
        ToastAndroid.show("Please select at least one image", ToastAndroid.SHORT);
        return;
      }

      // Check if category is selected
      if (!product.categoryId || product.categoryId.length === 0) {
        ToastAndroid.show("Please select category", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);
      const productId = generateProductId();
      const imageUrls = await uploadImages(selectedImageFiles, productId);
      
      const productData: productsType = {
        ...product,
        productId,
        images:imageUrls,
        stock: 3, // or values.stock if it's dynamic
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Validate the product data before saving
      if (!productData.categoryId) {
        throw new Error('Category is required');
      }

      await addDoc(collection(db, "products_data"), productData);
      
      // Show success state
      setShowSuccess(true);
      ToastAndroid.show("Product added successfully! 🎉", ToastAndroid.LONG);
      
      // Reset form but don't hide success overlay
      resetForm();

    } catch (error) {
      console.error("Error saving product:", error);
      ToastAndroid.show(error instanceof Error ? error.message : "Failed to save product", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
  };

  const handleGoHome = () => {
    router.replace('home' as never);
  };

  return (
    <View style={styles.container}>
      <Navbar title="Add Product" showBack={true} showSearch={false} />
   
      <ScrollView style={styles.scrollView}>
        
        {/* <Formik 
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          ref={formikRef}
        >
          {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => ( */}
            <View style={styles.formContainer}>
              {loading && (
                <View style={styles.loadingOverlay}>
                  <View style={styles.loadingContent}>
                    <View style={styles.loadingCard}>
                      <ActivityIndicator size="large" color="#4CAF50" />
                      <Text style={styles.loadingText}>Uploading Product...</Text>
                      <Text style={styles.loadingSubText}>Please wait while we process your product</Text>
                      <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>{progress}%</Text>
                        <View style={styles.progressBarContainer}>
                          <View style={[styles.progressBar, { width: `${progress}%` }]} />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {showSuccess && role === 'admin' && (
                <View style={styles.successOverlay}>
                  <View style={styles.successContent}>
                    <Ionicons name="checkmark-circle" size={150} color="#4CAF50" />
                    <Text style={styles.successText}>Product Added Successfully!</Text>
                    <Text style={styles.successSubText}>Your product has been added to the catalog</Text>
                    
                    <View style={styles.successButtonsContainer}>
                      <TouchableOpacity 
                        style={[styles.successButton, styles.addAnotherButton]} 
                        onPress={handleAddAnother}
                      >
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text style={styles.successButtonText}>Add Another Product</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.successButton, styles.goHomeButton]} 
                        onPress={handleGoHome}
                      >
                        <Ionicons name="home-outline" size={24} color="white" />
                        <Text style={styles.successButtonText}>Go to Home</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              
              {/* English Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name (English) *</Text>
                <TextInput
                  style={[styles.input, loading && styles.inputDisabled]}
                  onChangeText={(text) => updateProductNameEn(text)} // ✅ dot notation
                  value={product.name["en"]}
                  placeholder="Enter product name (English)"
                  editable={!loading}
                />
                {/* {touched.name?.en && errors.name?.en && (
                  <Text style={styles.errorText}>{errors.name.en}</Text>
                )} */}
              </View>

              {/* Amharic Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name (Amharic) *</Text>
                <TextInput
                  style={[styles.input, loading && styles.inputDisabled]}
                  onChangeText={(text) => updateProductNameAm(text)} // ✅ dot notation
                  value={product.name["am"]}
                  placeholder="Enter product name (Amharic)"
                  editable={!loading}
                />
                {/* {touched.name?.am && errors.name?.am && (
                  <Text style={styles.errorText}>{errors.name.am}</Text>
                )} */}
              </View>

             {/* Price Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={[styles.input, loading && styles.inputDisabled]}
                  onChangeText={(text) => updateProductPrice(text)}
                  // value={values.price === '' ? '' : String(values.price)}
                  placeholder="Enter price"
                  keyboardType="numeric"
                  editable={!loading}
                />
                {/* {touched.price && errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )} */}
              </View>

              {/* Category Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Select Categories *</Text>
                <View style={[styles.categoryContainer, loading && styles.inputDisabled]}>
                  {categoryList.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.categoryButton,
                        product.categoryId === category.categoryId && styles.selectedCategory
                      ]}
                      onPress={() => updateProductCategory(category.categoryId)}
                      disabled={loading}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          product.categoryId === category.categoryId && { color: 'white' }
                        ]}
                      >
                        {category.name.en} {/* or category.name if it's just a string */}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* {touched.categoryId && errors.categoryId && (
                  <Text style={styles.errorText}>{errors.categoryId}</Text>
                )} */}
              </View>

              {/* Image Upload */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Images</Text>
                <TouchableOpacity 
                  style={[styles.uploadButton, loading && styles.inputDisabled]} 
                  onPress={pickImages}
                  disabled={loading}
                >
                  <Text style={styles.uploadButtonText}>Pick Images</Text>
                  <Ionicons name="camera" size={40} color="#00685C" />
                </TouchableOpacity>
                <View style={styles.imagePreviewContainer}>
                  {selectedImageFiles.map((image, index) => (
                    <View key={index} style={styles.imagePreview}>
                      <Image source={{ uri: image.uri }} style={styles.previewImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => !loading && removeImage(image)}
                        disabled={loading}
                      >
                        <Ionicons name="close-circle" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {selectedImageFiles.length === 0 && (
                  <Text style={styles.errorText}>Please select at least one image</Text>
                )}
              </View>

              {/* Color Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Colors</Text>
                <View style={[styles.colorContainer, loading && styles.inputDisabled]}>
                  {PRODUCT_COLORS.colors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        product.colors.includes(color) && styles.selectedColor
                      ]}
                      onPress={() => {
                        if (!loading) {
                          const newColors = product.colors.includes(color)
                            ? product.colors.filter(c => c !== color)
                            : [...product.colors, color];
                            updateProductColor(newColors);
                        }
                      }}
                      disabled={loading}
                    />
                  ))}
                </View>
                {/* {touched.colors && errors.colors && (
                  <Text style={styles.errorText}>{errors.colors}</Text>
                )} */}
              </View>

              {/* English Description Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description(English)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, loading && styles.inputDisabled]}
                  onChangeText={(text) => updateProductDescriptionEn(text)} 
                  value={product.description.en}
                  placeholder="product description (english)"
                  multiline
                  numberOfLines={4}
                  editable={!loading}
                />
                {/* {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description.en}</Text>
                )} */}
              </View>


              {/* Amharic Description Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description(Amharic)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, loading && styles.inputDisabled]}
                  onChangeText={(text) => updateProductDescriptionAm(text)} 
                  value={product.description.am}
                  placeholder="product description (amharic)"
                  multiline
                  numberOfLines={4}
                  editable={!loading}
                />
                {/* {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description.am}</Text>
                )} */}
              </View>

             

              {/* Variants Section */}
              <View style={styles.inputContainer}>
                <View style={styles.variantHeader}>
                  <Text style={styles.label}>Variants</Text>
                  <TouchableOpacity
                    style={styles.addVariantButton}
                    onPress={() => {
                      const newVariants =  { name: '', price: 0, stock: 0 };
                      addVariant(newVariants);
                    }}
                  >
                    <Ionicons name="add-circle" size={24} color="#00685C" />
                  </TouchableOpacity>
                </View>

                {product.variants.map((variant, index) => (
                  <View key={index} style={styles.variantContainer}>
                    <View style={styles.variantRow}>
                      <View style={styles.variantInputContainer}>
                        <Text style={styles.variantLabel}>Name</Text>
                        <TextInput
                          style={styles.variantInput}
                          value={variant.name}
                          onChangeText={(text) => {
                            const newVariants = [...product.variants];
                            newVariants[index].name = text;
                            // setFieldValue('variants', newVariants);
                          }}
                          placeholder="Variant name"
                        />
                      </View>


                      <View style={styles.variantInputContainer}>
                      <Text style={styles.variantLabel}>Price</Text>
                      <TextInput
                        style={styles.variantInput}
                        value={variant.price ? String(variant.price) : ''} // number → string
                        onChangeText={(text) => {
                          const newVariants = [...product.variants];
                          newVariants[index].price =  parseFloat(text); // string → number
                          // setFieldValue('variants', newVariants);
                        }}
                        placeholder="Price"
                        keyboardType="numeric"
                      />
                    </View>

                      <View style={styles.variantInputContainer}>
                        <Text style={styles.variantLabel}>Stock</Text>
                        <TextInput
                          style={styles.variantInput}
                          value={variant.stock.toString()}
                          onChangeText={(text) => {
                            const newVariants = [...product.variants];
                            newVariants[index].stock = parseInt(text) || 0;
                            // setFieldValue('variants', newVariants);
                          }}
                          placeholder="Stock"
                          keyboardType="numeric"
                        />
                      </View>

                      <TouchableOpacity
                        style={styles.removeVariantButton}
                        onPress={() => {
                          const newVariants = product.variants.filter((_, i) => i !== index);
                          // setFieldValue('variants', newVariants);
                        }}
                      >
                        <Ionicons name="trash-outline" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* {touched.variants && errors.variants && (
                  <Text style={styles.errorText}>
                    {Array.isArray(errors.variants) 
                      ? 'Please fill in all variant fields correctly'
                      : String(errors.variants)}
                  </Text>
                )} */}
              </View>

              {/* New Product Toggle */}
              {/* <View style={styles.inputContainer}>
                <View style={styles.toggleContainer}>
                  <Text style={styles.label}>New Product</Text>
                  <Switch
                    value={values.isNew}
                    onValueChange={(value) => {
                      handleChange('isNew')(value.toString());
                    }}
                  />
                </View>
              </View> */}

              {role === 'admin' && (
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={() => handleSubmit(product)}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="white" />
                      <Text style={styles.loadingText}>Adding Product...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Add Product</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          {/* )}
        </Formik> */}
      </ScrollView>
    </View>
  );
};



export default function AddPostScreen() {
  return (
    <RequireAdmin>
      <AddPostContent />
    </RequireAdmin>
  );
} 



// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#00685C',
  },
  categoryText: {
    color: '#333',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
  uploadButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#00685C',
    borderStyle: 'dashed',
    backgroundColor: '#f9f9f9',
  },
  uploadButtonText: {
    color: '#00685C',
    fontSize: 16,
    fontWeight: '800',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#00685C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addVariantButton: {
    padding: 4,
  },
  variantContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  variantInputContainer: {
    flex: 1,
  },
  variantLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  variantInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  removeVariantButton: {
    padding: 8,
  },
  successOverlay: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successContent: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    textAlign: 'center',
  },
  successSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 30,
  },
  successButtonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 15,
  },
  successButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  addAnotherButton: {
    backgroundColor: '#4CAF50',
  },
  goHomeButton: {
    backgroundColor: '#2196F3',
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
    
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

