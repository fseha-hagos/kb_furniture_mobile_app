import { Video } from "expo-av";
import { BlurView } from "expo-blur";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "./ProgressBar";

interface props{
  image: string,
  video: string,
  progress: number
}

export function UploadingAndroid({ image, video, progress }: props) {
  // The component has the same logic. However, the blur effect works differently on Android.
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        },
      ]}
    >
      <BlurView
        intensity={20}
        style={StyleSheet.absoluteFill}
      />

      <BlurView
        intensity={50}
        style={{
          width: "70%",
          // Some styles could  work oncorrectly on Android.
        }}
      >
        <View
          style={{
            alignItems: "center",
            paddingVertical: 10,
            rowGap: 12,
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
          }}
        >
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
                borderRadius: 6,
              }}
            />
          )}
          {video && (
            <Video
              source={{
                uri: video,
              }}
              videoStyle={{}}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              //resizeMode="contain"
              // shouldPlay
              // isLooping
              style={{ width: 200, height: 200 }}
              // useNativeControls
            />
          )}
          <Text style={{ fontSize: 12 }}>Uploading...</Text>
          <ProgressBar progress={progress} />
          <View
            style={{
              height: 1,
              borderWidth: StyleSheet.hairlineWidth,
              width: "100%",
              borderColor: "#00000020",
            }}
          />
          <TouchableOpacity>
            <Text style={{ fontWeight: "500", color: "#3478F6", fontSize: 17 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}
