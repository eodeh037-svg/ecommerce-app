import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cart_items';

// Save cart
export const saveCartToStorage = async (cartItems: any[]) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.log('Error saving cart:', error);
  }
};

// Load cart
export const loadCartFromStorage = async () => {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Error loading cart:', error);
    return [];
  }
};