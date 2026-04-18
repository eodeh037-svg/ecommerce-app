import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cart_items';

export const saveCartToStorage = async (cartItems: any[]) => {
  try {
    if (!Array.isArray(cartItems)) return;

    await AsyncStorage.setItem(
      CART_KEY,
      JSON.stringify(cartItems)
    );
  } catch (error) {
    console.log('Error saving cart:', error);
  }
};

export const loadCartFromStorage = async () => {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);

    if (!data) return [];

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log('Error loading cart:', error);
    return [];
  }
};