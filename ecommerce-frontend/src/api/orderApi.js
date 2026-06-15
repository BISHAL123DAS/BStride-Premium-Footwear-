import axiosInstance from "./axiosInstance";

// Create order (COD or Razorpay)
export const createOrder = (orderData) => axiosInstance.post("/orders", orderData);

// Verify Razorpay payment
export const verifyPayment = (paymentData) => axiosInstance.post("/orders/verify-payment", paymentData);

// Get my orders
export const getMyOrders = () => axiosInstance.get("/orders/my-orders");

// Get single order
export const getSingleOrder = (id) => axiosInstance.get(`/orders/${id}`);