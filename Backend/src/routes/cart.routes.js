const express = require("express");
const Cart = require("../models/Cart.model");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/cart
router.get("/", authUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    res.json({ success: true, items: cart ? cart.items : [] });
  } catch (err) {
    console.error("CART GET ERROR:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// POST /api/cart/add
router.post("/addCart", authUser, async (req, res) => {
  try {
    const { product } = req.body;
    if (!product?._id) return res.status(400).json({ message: "Product required" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existing = cart.items.find(
      (i) => i.product.toString() === product._id
    );

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      }
    } else {
      cart.items.push({
        product:      product._id,
        name:         product.name,
        brand:        product.brand,
        image:        product.images?.[0] || "",
        price:        product.price,
        stock:        product.stock,
        category:     product.category,
        selectedSize: product.selectedSize || "",
        quantity:     1,
      });
    }

    await cart.save();
    res.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("CART ADD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/cart/increase/:productId
router.patch("/increase/:productId", authUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId
    );
    if (item && item.quantity < item.stock) {
      item.quantity += 1;
      await cart.save();
    }

    res.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("CART INCREASE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/cart/decrease/:productId
router.patch("/decrease/:productId", authUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex(
      (i) => i.product.toString() === req.params.productId
    );

    if (idx !== -1) {
      if (cart.items[idx].quantity === 1) {
        cart.items.splice(idx, 1);
      } else {
        cart.items[idx].quantity -= 1;
      }
      await cart.save();
    }

    res.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("CART DECREASE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", authUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );
    await cart.save();

    res.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("CART REMOVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/clear
router.delete("/clear", authUser, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { upsert: true }
    );
    res.json({ success: true, items: [] });
  } catch (err) {
    console.error("CART CLEAR ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;