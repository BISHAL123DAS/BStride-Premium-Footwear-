const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order.model");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Razorpay instance (lazy — only created when keys are set) ─
// TODO: Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not configured in .env");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ─────────────────────────────────────────────────────────────
// POST /api/orders  —  create order (COD or Razorpay)
// ─────────────────────────────────────────────────────────────
router.post("/", authUser, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod,
    itemsTotal, deliveryFee, discount, totalAmount } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in order" });

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: paymentMethod === "COD" ? "confirmed" : "pending",
      itemsTotal,
      deliveryFee,
      discount,
      totalAmount,
    });

    // Razorpay — create payment order
    if (paymentMethod === "Razorpay") {
      const razorpay = getRazorpay(); // throws clear error if keys missing
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // convert to paise
        currency: "INR",
        receipt: order._id.toString(),
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        success: true,
        order,
        razorpayOrder,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // COD
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/orders/verify-payment  —  verify Razorpay signature
// ─────────────────────────────────────────────────────────────
router.post("/verify-payment", authUser, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid payment signature" });

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "paid", orderStatus: "confirmed", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    res.json({ success: true, order });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/orders/my-orders  —  user's order history
// ─────────────────────────────────────────────────────────────
router.get("/my-orders", authUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/orders/:id  —  single order
// ─────────────────────────────────────────────────────────────
router.get("/:id", authUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not authorized" });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

module.exports = router;