import axios from "axios";

const API = axios.create({ baseURL: "/api", withCredentials: true });

export const fetchCart         = ()          => API.get("/cart");
export const addToCartAPI      = (product)   => API.post("/cart/addCart", { product });
export const increaseQtyAPI    = (productId) => API.patch(`/cart/increase/${productId}`);
export const decreaseQtyAPI    = (productId) => API.patch(`/cart/decrease/${productId}`);
export const removeFromCartAPI = (productId) => API.delete(`/cart/remove/${productId}`);
export const clearCartAPI      = ()          => API.delete("/cart/clear");