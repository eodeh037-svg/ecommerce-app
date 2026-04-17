import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { loadCartFromStorage } from './storage/ cartStorage'
import { setCart } from './redux/cartSlice';
import { AppState } from 'react-native';
import { useRef } from 'react';
function AppWrapper() {
  const dispatch = useDispatch();
const appState = useRef(AppState.currentState);

useEffect(() => {
  const subscription = AppState.addEventListener('change', nextState => {
    if (appState.current.match(/active/) && nextState === 'background') {
      console.log('App went to background');
    }

    appState.current = nextState;
  });

  return () => {
    subscription.remove();
  };
}, []);
  useEffect(() => {
    const initCart = async () => {
      const savedCart = await loadCartFromStorage();
      dispatch(setCart(savedCart));
    };

    initCart();
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}