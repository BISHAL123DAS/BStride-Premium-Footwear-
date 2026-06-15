// import { createSlice } from "@reduxjs/toolkit";

// // ── helpers ──────────────────────────────────────────────────
// const loadCart = (userId) => {
//   try {
//     const raw = localStorage.getItem(`cart_${userId}`);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// };

// const saveCart = (userId, items) => {
//   try {
//     localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
//   } catch {}
// };

// // ── initial state ─────────────────────────────────────────────
// const initialState = {
//   cartsByUser: {}, // { [userId]: CartItem[] }
// };

// // ── CartItem shape ────────────────────────────────────────────
// // { _id, name, brand, category, price, images, stock, quantity }

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     // Call this on login / app mount to hydrate from localStorage
//     loadUserCart(state, action) {
//       const { userId } = action.payload;
//       if (!state.cartsByUser[userId]) {
//         state.cartsByUser[userId] = loadCart(userId);
//       }
//     },

//     addToCart(state, action) {
//       const { userId, product } = action.payload;
//       if (!state.cartsByUser[userId]) {
//         state.cartsByUser[userId] = loadCart(userId);
//       }
//       const items = state.cartsByUser[userId];
//       const existing = items.find((i) => i._id === product._id);
//       if (existing) {
//         // Respect stock limit
//         if (existing.quantity < product.stock) {
//           existing.quantity += 1;
//         }
//       } else {
//         items.push({ ...product, quantity: 1 });
//       }
//       saveCart(userId, items);
//     },

//     removeFromCart(state, action) {
//       const { userId, productId } = action.payload;
//       if (!state.cartsByUser[userId]) return;
//       state.cartsByUser[userId] = state.cartsByUser[userId].filter(
//         (i) => i._id !== productId
//       );
//       saveCart(userId, state.cartsByUser[userId]);
//     },

//     increaseQty(state, action) {
//       const { userId, productId } = action.payload;
//       if (!state.cartsByUser[userId]) return;
//       const item = state.cartsByUser[userId].find((i) => i._id === productId);
//       if (item && item.quantity < item.stock) {
//         item.quantity += 1;
//         saveCart(userId, state.cartsByUser[userId]);
//       }
//     },

//     decreaseQty(state, action) {
//       const { userId, productId } = action.payload;
//       if (!state.cartsByUser[userId]) return;
//       const item = state.cartsByUser[userId].find((i) => i._id === productId);
//       if (item) {
//         if (item.quantity === 1) {
//           // Auto-remove when qty hits 0
//           state.cartsByUser[userId] = state.cartsByUser[userId].filter(
//             (i) => i._id !== productId
//           );
//         } else {
//           item.quantity -= 1;
//         }
//         saveCart(userId, state.cartsByUser[userId]);
//       }
//     },

//     clearCart(state, action) {
//       const { userId } = action.payload;
//       state.cartsByUser[userId] = [];
//       saveCart(userId, []);
//     },
//   },
// });

// export const {
//   loadUserCart,
//   addToCart,
//   removeFromCart,
//   increaseQty,
//   decreaseQty,
//   clearCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;

// // ── Selectors ─────────────────────────────────────────────────
// export const selectUserCart = (userId) => (state) =>
//   state.cart.cartsByUser[userId] ?? [];

// export const selectCartCount = (userId) => (state) =>
//   (state.cart.cartsByUser[userId] ?? []).reduce(
//     (sum, i) => sum + i.quantity,
//     0
//   );

// export const selectCartTotal = (userId) => (state) =>
//   (state.cart.cartsByUser[userId] ?? []).reduce(
//     (sum, i) => sum + i.price * i.quantity,
//     0
//   );



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCartAPI,
  increaseQtyAPI,
  decreaseQtyAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "../api/cartApi";

// ── Async Thunks ──────────────────────────────────────────────

export const loadCart = createAsyncThunk(
  "cart/load",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchCart();
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (product, { rejectWithValue }) => {
    try {
      const res = await addToCartAPI(product);
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const increaseQty = createAsyncThunk(
  "cart/increase",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await increaseQtyAPI(productId);
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const decreaseQty = createAsyncThunk(
  "cart/decrease",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await decreaseQtyAPI(productId);
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await removeFromCartAPI(productId);
      return res.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await clearCartAPI();
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {
    // ← sync reset — no API call, instant Redux clear
    resetCart: (state) => {
      state.items   = [];
      state.loading = false;
      state.error   = "";
    },
  },
  extraReducers: (builder) => {
    const setItems   = (state, action) => { state.items = action.payload; state.loading = false; state.error = ""; };
    const setLoading = (state)         => { state.loading = true; state.error = ""; };
    const setError   = (state, action) => { state.loading = false; state.error = action.payload; };

    [loadCart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart].forEach((thunk) => {
      builder
        .addCase(thunk.pending,   setLoading)
        .addCase(thunk.fulfilled, setItems)
        .addCase(thunk.rejected,  setError);
    });
  },
});

export default cartSlice.reducer;
export const { resetCart } = cartSlice.actions; // ← sync action export

// ── Selectors ─────────────────────────────────────────────────
export const selectCartItems   = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError   = (state) => state.cart.error;

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);