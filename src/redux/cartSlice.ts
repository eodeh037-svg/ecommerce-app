import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Product = {
  id: number ;
  title: string;
  price: number;
  thumbnail?: string;
};

type CartState = {
  items: Product[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const exists = state.items.find(
        item => item.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        item => item.id !== action.payload
      );
    },
    setCart(state, action) {
  state.items = action.payload;
},

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;