import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: { product: any };
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '800',
          },
        }}
      >
        {/* HOME - NO HEADER (clean ecommerce feel) */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

 
        <Stack.Screen
          name="Details"
          component={ProductDetailsScreen}
          options={{ headerShown: true }}
        />

        {/* CART */}
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{
            title: 'Your Cart 🛒',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}