import { Ionicons } from '@expo/vector-icons'; // Make sure to install: expo install @expo/vector-icons
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface FloatingCustomerServiceButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
}

const FloatingCustomerServiceButton: React.FC<FloatingCustomerServiceButtonProps> = ({ onPress }) => {
  const backgroundColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  return (
    <TouchableOpacity style={[styles.floatingButton, { backgroundColor }]} onPress={onPress}>
      <Ionicons name="chatbubbles-outline" size={24} color={textColor} />
      <Text style={[styles.buttonText, { color: textColor }]}>Chat</Text>
    </TouchableOpacity>
  );
};

export default FloatingCustomerServiceButton;

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    // backgroundColor: '#007AFF', // replaced with theme color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    // color: '#fff', // replaced with theme color
    marginLeft: 8,
    fontWeight: '600',
  },
});
