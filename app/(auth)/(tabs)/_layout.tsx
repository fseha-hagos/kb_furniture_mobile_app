import { Colors } from "@/constants/Colors";
// import { useGlobalScreenshotPrevention } from '@/hooks/useGlobalScreenshotPrevention';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
          size={20} 
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

  const { t } = useTranslation();
  
  // Enable global screenshot prevention for all tab pages
  // useGlobalScreenshotPrevention();
  
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
          fontSize: 9,
          fontWeight: '400',
          marginTop: 1,
        },
        tabBarStyle: {
          left: 20,
          right: 20,
          elevation: 8,
          height: 65,
          borderTopWidth: 0,
          paddingBottom: 4,
          paddingTop: 4,
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
          paddingVertical: 6,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[Colors.dark.background, Colors.dark.background]}
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
          title: t('home'),
          headerShown: false,
          tabBarLabel: t('home'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="home"
              label={t('home')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('explore'),
          headerShown: false,
          tabBarLabel: t('explore'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="search"
              label={t('explore')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites'),
          headerShown: false,
          tabBarLabel: t('favorites'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="heart"
              label={t('favorites')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          headerShown: false,
          tabBarLabel: t('profile'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              focused={focused} 
              color={color} 
              iconName="person"
              label={t('profile')}
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
    width: 50,
    height: 45,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
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