// components/SlideFormModal.tsx
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { slidesType } from "@/types/type";
import { Image } from "expo-image";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  slider: slidesType;
  updateEnglishTitle: (t: string) => void;
  updateAmharicTitle: (t: string) => void;
  updateEnglishDescription: (t: string) => void;
  updateAmharicDescription: (t: string) => void;
  updatePrice: (p: string) => void;
  updateImage: (url: string) => void;   // 👈 new
}

const SlideFormModal = ({
  visible,
  onClose,
  onSave,
  slider,
  updateEnglishTitle,
  updateAmharicTitle,
  updateEnglishDescription,
  updateAmharicDescription,
  updatePrice,
  updateImage,
}: Props) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add / Edit Slide</Text>

          
          {/* Image Preview */}
          {slider.image ? (
            <Image source={{ uri: slider.image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={{ color: "#666" }}>No image selected</Text>
            </View>
          )}
          <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImageFromGallery}>
            <Text style={{ color: "#2196F3" }}>
                 Change Image
            </Text>
            </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Title (English)"
            value={slider.title.en}
            onChangeText={updateEnglishTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Title (Amharic)"
            value={slider.title.am}
            onChangeText={updateAmharicTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Description (English)"
            value={slider.description.en}
            onChangeText={updateEnglishDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Description (Amharic)"
            value={slider.description.am}
            onChangeText={updateAmharicDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={String(slider.price)}
            onChangeText={updatePrice}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={onClose}
            >
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.saveBtn]}
              onPress={onSave}
            >
              <Text style={styles.modalBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SlideFormModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelBtn: {
    backgroundColor: "#999",
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
