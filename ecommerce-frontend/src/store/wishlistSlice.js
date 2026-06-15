import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchWishlist,
  addToWishlistAPI,
  removeFromWishlistAPI,
  clearWishlistAPI,
} from "../api/wishlistApi";

// ── Async Thunks ──────────────────────────────────────────────

export const loadWishlist = createAsyncThunk(
  "wishlist/load",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchWishlist();
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (product, { rejectWithValue }) => {
    try {
      const res = await addToWishlistAPI(product);
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await removeFromWishlistAPI(productId);
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clear",
  async (_, { rejectWithValue }) => {
    try {
      await clearWishlistAPI();
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {
    // ← sync reset — no API call, instant Redux clear
    resetWishlist: (state) => {
      state.items   = [];
      state.loading = false;
      state.error   = "";
    },
  },
  extraReducers: (builder) => {
    const setItems   = (state, action) => { state.items = action.payload; state.loading = false; state.error = ""; };
    const setLoading = (state)         => { state.loading = true; state.error = ""; };
    const setError   = (state, action) => { state.loading = false; state.error = action.payload; };

    [loadWishlist, addToWishlist, removeFromWishlist, clearWishlist].forEach((thunk) => {
      builder
        .addCase(thunk.pending,   setLoading)
        .addCase(thunk.fulfilled, setItems)
        .addCase(thunk.rejected,  setError);
    });
  },
});

export default wishlistSlice.reducer;
export const { resetWishlist } = wishlistSlice.actions; // ← sync action export

// ── Selectors ─────────────────────────────────────────────────
export const selectWishlistItems   = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistCount   = (state) => state.wishlist.items.length;

export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((p) => p._id === productId);