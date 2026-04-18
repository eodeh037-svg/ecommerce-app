import React, { useEffect, useRef, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { AppState } from 'react-native';

import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';

import { loadCartFromStorage } from './storage/ cartStorage';
import { setCart } from './redux/cartSlice';

function AppWrapper() {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);

  const [ready, setReady] = useState(false);


  useEffect(() => {
    const initCart = async () => {
      try {
        const savedCart = await loadCartFromStorage();

      
        dispatch(setCart(savedCart || []));
      } catch (error) {
        console.log('Failed to load cart:', error);
        dispatch(setCart([]));
      } finally {
        setReady(true);
      }
    };

    initCart();
  }, [dispatch]);

 
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const prevState = appState.current;

      if (prevState === 'active' && nextState === 'background') {
        console.log('App went to background');
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

 
  if (!ready) return null;

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}