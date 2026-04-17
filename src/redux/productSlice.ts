import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page: number) => {
    const res = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${page * 10}`
    );
    return res.json();
  }
);

// State type
type ProductState = {
  products: any[];
  loading: boolean;
  error: string | null;
  page: number;
  searchQuery: string;
};

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  page: 0,
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    resetProducts(state) {
      state.products = [];
      state.page = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // append products (pagination)
        state.products = [
          ...state.products,
          ...action.payload.products,
        ];

        state.page += 1;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch products';
      });
  },
});

export const { setSearchQuery, resetProducts } = productSlice.actions;
export default productSlice.reducer;