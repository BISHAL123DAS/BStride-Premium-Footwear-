import axios from "axios";

const API = axios.create({ baseURL: "/api", withCredentials: true });

export const fetchWishlist = () => API.get("/wishlist");

export const addToWishlistAPI = (product) =>
  API.post("/wishlist/add", { product });

export const removeFromWishlistAPI = (productId) =>
  API.delete(`/wishlist/remove/${productId}`);

export const clearWishlistAPI = () => API.delete("/wishlist/clear");
