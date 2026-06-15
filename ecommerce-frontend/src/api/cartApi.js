import axiosInstance from "./axiosInstance";

export const fetchCart         = ()          => axiosInstance.get("/cart");
export const addToCartAPI      = (product)   => axiosInstance.post("/cart/addCart", { product });
export const increaseQtyAPI    = (productId) => axiosInstance.patch(`/cart/increase/${productId}`);
export const decreaseQtyAPI    = (productId) => axiosInstance.patch(`/cart/decrease/${productId}`);
export const removeFromCartAPI = (productId) => axiosInstance.delete(`/cart/remove/${productId}`);
export const clearCartAPI      = ()          => axiosInstance.delete("/cart/clear");