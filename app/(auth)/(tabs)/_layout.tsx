import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const TabIcon = ({ focused, color, iconName, label }: { 
  focused: boolean; 
  color: string; 
  iconName: "home" | "search" | "heart" | "person";
  label: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {focused && (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.activeBackground}
          />
        )}
        <Ionicons 
          name={focused ? iconName : `${iconName}-outline`} 
          size={24} 
          color={color} 
        />
      </Animated.View>
      {focused && (
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              backgroundColor: color,
              opacity: opacityAnim,
            },
          ]}
        />
      )}
    </View>
  );
};

export default function Layout() {
  const router = useRouter();
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        tabBarShowLabel: true,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "Jakarta",
          fontSize: 12,
          fontWeight: '600',
          marginTop: 6,
        },
        tabBarStyle: {
          left: 20,
          right: 20,
          elevation: 8,
          height: 75,
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#00685C', '#00897B']}
            style={styles.tabBarBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="home"
              label="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="search"
              label="Explore"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          headerShown: false,
          tabBarLabel: "Favorites",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="heart"
              label="Favorites"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="person"
              label="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 60,
    height: 55,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
});