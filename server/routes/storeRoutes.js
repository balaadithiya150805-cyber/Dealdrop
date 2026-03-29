import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// 🏪 Get Products by Shop Name
router.get("/:shopName", async (req, res) => {
  try {
    const { shopName } = req.params;

    const products = await Product.find({ shopName }).lean();

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this shop" });
    }

    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
