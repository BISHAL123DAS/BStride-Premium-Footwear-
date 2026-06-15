const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:         { type: String, required: true },
  brand:        { type: String },
  image:        { type: String },
  price:        { type: Number, required: true },
  quantity:     { type: Number, required: true, min: 1 },
  selectedSize: { type: String, default: "" },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName:    { type: String, required: true },
  phone:       { type: String, required: true },
  addressLine: { type: String, required: true },
  city:        { type: String, required: true },
  state:       { type: String, required: true },
  pincode:     { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,

    paymentMethod:    { type: String, enum: ["COD", "Razorpay"], required: true },
    paymentStatus:    { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    razorpayOrderId:  { type: String },
    razorpayPaymentId:{ type: String },

    itemsTotal:  { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount:    { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);