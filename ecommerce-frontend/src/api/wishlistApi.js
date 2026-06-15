import axiosInstance from "./axiosInstance";

export const fetchWishlist = () => axiosInstance.get("/wishlist");

export const addToWishlistAPI = (product) =>
  axiosInstance.post("/wishlist/add", { product });

export const removeFromWishlistAPI = (productId) =>
  axiosInstance.delete(`/wishlist/remove/${productId}`);

export const clearWishlistAPI = () => axiosInstance.delete("/wishlist/clear");