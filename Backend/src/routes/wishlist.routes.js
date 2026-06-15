const express = require("express");
const Wishlist = require("../models/Wishlist.model");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/wishlist
router.get("/", authUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    res.json({ success: true, items: wishlist ? wishlist.items : [] });
  } catch (err) {
    console.error("WISHLIST GET ERROR:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist/add
router.post("/add", authUser, async (req, res) => {
  try {
    const { product } = req.body;
    if (!product?._id) return res.status(400).json({ message: "Product required" });

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user.id, items: [] });

    const already = wishlist.items.some(
      (i) => i.product.toString() === product._id
    );

    if (!already) {
      wishlist.items.push({
        product:  product._id,
        name:     product.name,
        brand:    product.brand,
        images:   product.images || [],
        price:    product.price,
        stock:    product.stock,
        category: product.category,
      });
      await wishlist.save();
    }

    res.json({ success: true, items: wishlist.items });
  } catch (err) {
    console.error("WISHLIST ADD ERROR:", err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/remove/:productId
router.delete("/remove/:productId", authUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );
    await wishlist.save();

    res.json({ success: true, items: wishlist.items });
  } catch (err) {
    console.error("WISHLIST REMOVE ERROR:", err);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
});

// DELETE /api/wishlist/clear
router.delete("/clear", authUser, async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { upsert: true }
    );
    res.json({ success: true, items: [] });
  } catch (err) {
    console.error("WISHLIST CLEAR ERROR:", err);
    res.status(500).json({ message: "Failed to clear wishlist" });
  }
});

module.exports = router;