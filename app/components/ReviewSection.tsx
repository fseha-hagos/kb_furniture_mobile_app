import { useThemeColor } from '@/hooks/useThemeColor';
import { reviewsType } from '@/types/type';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useProduct } from '../context/productContext';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { reviews, addReview, getProductReviews, getAverageRating } = useProduct();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [productReviews, setProductReviews] = useState<reviewsType[]>([]);

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'tint');
  const subtextColor = useThemeColor({}, 'icon'); // Use icon color for subtext
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault');
  const tabIconSelectedColor = useThemeColor({}, 'tabIconSelected');
  const border = useThemeColor({}, 'border');


  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [reviews, avgRating] = await Promise.all([
        getProductReviews(productId),
        getAverageRating(productId)
      ]);
      setProductReviews(reviews);
      setAverageRating(avgRating);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setReviewImages([...reviewImages, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (rating > 0 && comment.trim() && userName.trim()) {
      try {
        await addReview({
          productId,
          userId: 'user123', // This should come from your auth system
          rating,
          comment: comment.trim(),
          userName: userName.trim(),
          images: reviewImages,
        });
        setModalVisible(false);
        setRating(0);
        setComment('');
        setUserName('');
        setReviewImages([]);
        await loadReviews(); // Reload reviews after adding new one
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews & Ratings</Text>
        <TouchableOpacity
          style={[styles.addReviewButton, {backgroundColor: secondaryColor}]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addReviewText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingSummary}>
        <View style={styles.averageRating}>
          <Text style={styles.ratingNumber}>{averageRating.toFixed(1)}</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= averageRating ? 'star' : 'star-o'}
                size={20}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.totalReviews}>{productReviews.length} reviews</Text>
        </View>
      </View>

      <ScrollView style={styles.reviewsList}>
        {productReviews.map((review) => (
          <View key={review.reviewId} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= review.rating ? 'star' : 'star-o'}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            {review.images && review.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.reviewImagesContainer}>
                {review.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.reviewImage}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={userName}
              onChangeText={setUserName}
            />

            <View style={styles.ratingInput}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}>
                    <FontAwesome
                      name={star <= rating ? 'star' : 'star-o'}
                      size={24}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={[styles.input, styles.commentInput]}
              placeholder="Write your review..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
            />

            <View style={styles.imageSection}>
              <Text style={styles.imageSectionTitle}>Add Photos (Optional)</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagePickerContainer}>
                {reviewImages.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}>
                      <FontAwesome name="times-circle" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
                {reviewImages.length < 5 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={pickImage}>
                    <FontAwesome name="camera" size={24} color="#00685C" />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, {backgroundColor: primaryColor}]}
                onPress={handleSubmitReview}>
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addReviewButton: {
    
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewText: {
    color: 'white',
    fontWeight: '500',
  },
  ratingSummary: {
    marginBottom: 16,
  },
  averageRating: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  totalReviews: {
    color: '#666',
  },
  reviewsList: {
    flex: 1,
  },
  reviewItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerName: {
    fontWeight: 'bold',
  },
  reviewDate: {
    color: '#666',
  },
  reviewComment: {
    marginTop: 8,
    lineHeight: 20,
  },
  reviewImagesContainer: {
    marginTop: 12,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  commentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  ratingInput: {
    marginBottom: 16,
  },
  ratingLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  imageSection: {
    marginBottom: 16,
  },
  imageSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  imageContainer: {
    marginRight: 8,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#00685C',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: '#00685C',
    marginTop: 4,
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButtonText: {
    color: 'white',
  },
});

export default ReviewSection; 