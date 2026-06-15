import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlistSlice";
import cartReducer from "./Cartslice";

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,   
  },
});

export default store;
