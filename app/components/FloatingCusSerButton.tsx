import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAuth } from '../context/cartContext';

interface FloatingCustomerServiceButtonProps {
  onPressChat?: (event: GestureResponderEvent) => void;
  onPressCart?: (event: GestureResponderEvent) => void;
}

export const FloatingCustomerServiceButton: React.FC<FloatingCustomerServiceButtonProps> = ({
  onPressChat,
  onPressCart,
}) => {
  const backgroundColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const { carts } = useAuth();

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
    <View style={styles.floatingContainer} >
      {/* Chat Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor }]}
        onPress={onPressChat}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles-outline" size={24} color={"white"} />
        <Text style={[styles.buttonText, {color:'white'}]}>Chat</Text>
      </TouchableOpacity>

      {/* Cart Button */}
      <TouchableOpacity
        style={[styles.cartButton, { backgroundColor }]}
        onPress={onPressCart}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="cart-outline" size={24} color="#fff" />
        {carts?.length ? (
          <View style={styles.cartCount}>
            <Text style={styles.cartCountText}>{carts.length}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default FloatingCustomerServiceButton;

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    zIndex:9999,
    bottom: 70,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // space between chat & cart
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  cartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cartCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cartCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
