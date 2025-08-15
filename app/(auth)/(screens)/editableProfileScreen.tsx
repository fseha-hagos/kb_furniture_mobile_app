// ProfileScreen.js
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { user: clerkUser } = useClerk();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);


  useEffect(() => {
    if (isLoaded && user) {
      setProfile({
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || "",
        avatar: user.imageUrl || ""
      });
    }
  }, [isLoaded, user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      setProfile({ ...profile, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!clerkUser) {
      Alert.alert("Error", "User not loaded. Please try again.");
      return;
    }

    setLoading(true);

    try {

      // Split name into first and last
      const [firstName, ...lastParts] = profile.name.split(" ");
      const lastName = lastParts.join(" ");

      await clerkUser.update({
        firstName,
        lastName,
        // primaryEmailAddressId: clerkUser.primaryEmailAddressId,
        // primaryPhoneNumberId: clerkUser.primaryPhoneNumberId
      });

      Alert.alert("Profile Updated", "Your changes have been saved.");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };


  // Change password
  const handleChangePassword = async () => {
    if (!clerkUser) {
      Alert.alert("Error", "User not loaded. Please try again.");
      return;
    }

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      Alert.alert("Error", "Please fill in both password fields.");
      return;
    }

    // if (passwordData.newPassword !== passwordData.confirmPassword) {
    //   Alert.alert("Error", "New passwords do not match.");
    //   return;
    // }
    setPasswordLoading(true);
    try {
      // setPasswordLoading(true);

      await clerkUser.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      Alert.alert("Success", "Password changed successfully.");
    } catch (err: unknown) {
      console.error("Password change error:", err);
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        const clerkErrors = (err as any).errors;
        Alert.alert("Error", clerkErrors[0]?.message || "Something went wrong");
      } else {
        // Generic error fallback
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
      <ActivityIndicator size="large" color="#2C1B14" />
      <Text>Loading profile...</Text>
    </View>
    );
  }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // adjust if you have a header
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 0 }}
        keyboardShouldPersistTaps="handled"
      >
    {/* <ScrollView style={styles.container}> */}
      
      {/* Avatar */}
      <View style={styles.header}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={{ color: "#fff" }}>No Image</Text>
          </View>
        )}
        <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          editable={false}
        />

        {/* <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
        /> */}
      </View>

      {/* Save Button with Loading */}
      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Password Change Section */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={passwordData.currentPassword}
          onChangeText={(text) =>
            setPasswordData({ ...passwordData, currentPassword: text })
          }
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={passwordData.newPassword}
          onChangeText={(text) =>
            setPasswordData({ ...passwordData, newPassword: text })
          }
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={passwordData.confirmPassword}
          onChangeText={(text) =>
            setPasswordData({ ...passwordData, confirmPassword: text })
          }
        />

        <TouchableOpacity
          style={[styles.saveButton, passwordLoading && { opacity: 0.6 }]}
          onPress={handleChangePassword}
          disabled={passwordLoading}
        >
          {passwordLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center"
  },
  changePhotoBtn: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#2C1B14"
  },
  changePhotoText: { color: "#fff", fontSize: 14 },
  inputCard: {
    margin: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2
  },
  label: { fontSize: 14, color: "#666", marginTop: 10 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    fontSize: 16,
    paddingVertical: 5,
    color: "#333"
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#2C1B14",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
