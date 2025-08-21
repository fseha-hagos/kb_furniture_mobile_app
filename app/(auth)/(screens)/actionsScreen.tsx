import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import SlideFormModal from "@/app/components/SlideFormModal";
import { handleFirebaseError } from "@/app/utils/firebaseErrorHandler";
import { SLIDER_DATA } from "@/constants/configurations";
import { db } from "@/firebaseConfig";
import { useThemeColor } from "@/hooks/useThemeColor";
import { marqueeType, slidesType } from "@/types/type";
import * as ImagePicker from 'expo-image-picker';



const ActionsScreen = () => {
  const [sliderList, setSliderList] = useState<slidesType[]>([]);
  const [marqueeList, setMarqueeList] = useState<marqueeType[]>([]);
  const [isSlidesLoading, setIsSlidesLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [newSlider, setNewSlider] = useState<slidesType>({
    id: "",
    title: { am: "", en: "" },
    image: "",
    description: { am: "", en: "" },
    price: 0,
  });

  const primaryColor = useThemeColor({}, "primary");

  /** 🔹 Small updaters */
  const updateEnglishTitle = (t: string) =>
    setNewSlider((p) => ({ ...p, title: { ...p.title, en: t } }));
  const updateAmharicTitle = (t: string) =>
    setNewSlider((p) => ({ ...p, title: { ...p.title, am: t } }));
  const updateEnglishDescription = (t: string) =>
    setNewSlider((p) => ({ ...p, description: { ...p.description, en: t } }));
  const updateAmharicDescription = (t: string) =>
    setNewSlider((p) => ({ ...p, description: { ...p.description, am: t } }));
  const updatePrice = (p: string) =>
    setNewSlider((prev) => ({ ...prev, price: Number(p) }));
  
// image updater
const updateImage = (url: string) => {
    setNewSlider((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
  s
    if (!result.canceled) return;
   
    setNewSlider(prev => ({ ...prev, image: result.assets[0].uri }));
  };

  /** 🔹 Fetch Slides */
  const getSliders = async () => {
    try {
      const snap = await getDocs(collection(db, SLIDER_DATA));
      const sliders: slidesType[] = [];
      snap.forEach((docSnap) =>
        sliders.push({ ...(docSnap.data() as slidesType), id: docSnap.id })
      );
      setSliderList(sliders);
    } catch (e) {
      handleFirestoreError(e);
    } finally {
      setIsSlidesLoading(false);
    }
  };

  /** 🔹 Save Slide (Add/Edit) */
  const handleAddSlide = async () => {
    try {
      if (!newSlider.image) {
        Alert.alert("Error", "Image URL required");
        return;
      }

      // TODO: addDoc() or updateDoc() depending on newSlider.id
      console.log("Saving slide", newSlider);

      setIsModalVisible(false);
      await getSliders();
    } catch (e) {
      handleFirestoreError(e);
    }
  };

  /** 🔹 Edit */
  const editSlide = async (id: string, updated: Partial<slidesType>) => {
    await updateDoc(doc(db, SLIDER_DATA, id), updated);
    getSliders();
  };

  /** 🔹 Delete */
  const deleteSlide = async (id: string) => {
    Alert.alert("Delete Slide", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, SLIDER_DATA, id));
          getSliders();
        },
      },
    ]);
  };

  

  const handleFirestoreError = async (error: any) => {
    console.error('Firestore error:', error);

    const result = await handleFirebaseError(error, {
      enableAppReload: true,
      showAlert: true,
    });

    if (result.success) {
      return;
    }

    if (result.shouldReload) return;

    // setIsOffline(true);
    // setError(
    //   'An error occurred while fetching data. Please check your internet connection and try again.'
    // );
  };


  
  /** 🔹 Add/Edit/Delete Marquee (same pattern as slides) */
//   const addMarquee = async (text: string) => {
//     try {
//       await addDoc(collection(db, 'Marquees'), { text });
//       getMarquees();
//     } catch (error) {
//       handleFirestoreError(error);
//     }
//   };

//   const editMarquee = async (id: string, text: string) => {
//     try {
//       await updateDoc(doc(db, 'Marquees', id), { text });
//       getMarquees();
//     } catch (error) {
//       handleFirestoreError(error);
//     }
//   };

//   const deleteMarquee = async (id: string) => {
//     Alert.alert('Delete Text', 'Are you sure you want to delete this marquee?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             await deleteDoc(doc(db, 'Marquees', id));
//             getMarquees();
//           } catch (error) {
//             handleFirestoreError(error);
//           }
//         },
//       },
//     ]);
//   };



  useEffect(() => {
    getSliders();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Admin Actions</Text>

      <Text style={{ marginTop: 20, fontSize: 18 }}>Slides</Text>
      {isSlidesLoading ? (
        <Text>Loading...</Text>
      ) : (
        sliderList.map((item) => (
          <View key={item.id} style={{ padding: 6, borderBottomWidth: 1 }}>
            <Text>{item.title?.en}</Text>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.slideImage} />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.editBtn]}
                onPress={() =>
                  editSlide(item.id, {
                    title: { en: "Updated", am: "አስተካክሏል" },
                  })
                }
              >
                <Ionicons name="create-outline" size={18} color="white" />
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={() => deleteSlide(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="white" />
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: primaryColor }]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ Add Slide</Text>
      </TouchableOpacity>

      <SlideFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleAddSlide}
        slider={newSlider}
        updateEnglishTitle={updateEnglishTitle}
        updateAmharicTitle={updateAmharicTitle}
        updateEnglishDescription={updateEnglishDescription}
        updateAmharicDescription={updateAmharicDescription}
        updatePrice={updatePrice}
        updateImage= {updateImage}
      />
    </ScrollView>
  );
};

export default ActionsScreen;

const styles = StyleSheet.create({
  imageContainer: { width: "100%", height: 100 },
  slideImage: { width: "100%", height: "100%", borderRadius: 8 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  btn: {
    flexDirection: "row",
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtn: { backgroundColor: "#4CAF50" },
  deleteBtn: { backgroundColor: "#F44336" },
  btnText: { color: "#fff", fontWeight: "bold" },
  addBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
