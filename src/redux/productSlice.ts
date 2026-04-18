import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  searchQuery: string;
  hasMore: boolean;
};

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  number,
  { rejectValue: string }
>('products/fetchProducts', async (page, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${page * 10}`
    );

    if (!res.ok) {
      throw new Error('Network error');
    }

    return await res.json();
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch products');
  }
});

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  page: 0,
  searchQuery: '',
  hasMore: true,
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
      state.hasMore = true;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
  
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        const newProducts = action.payload.products;

 
        const uniqueProducts = newProducts.filter(
          (newItem) => !state.products.some((p) => p.id === newItem.id)
        );

        state.products = [...state.products, ...uniqueProducts];

        state.page += 1;

      
        state.hasMore = state.products.length < action.payload.total;
      })

   
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch products';
      });
  },
});



export const { setSearchQuery, resetProducts } = productSlice.actions;
export default productSlice.reducer;