import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Create order (COD or Razorpay)
export const createOrder = (orderData) => API.post("/orders", orderData);

// Verify Razorpay payment
export const verifyPayment = (paymentData) => API.post("/orders/verify-payment", paymentData);

// Get my orders
export const getMyOrders = () => API.get("/orders/my-orders");

// Get single order
export const getSingleOrder = (id) => API.get(`/orders/${id}`);