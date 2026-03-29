import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// 📍 Get Nearby Products
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    const maxDistance = Number(radius) || 5000;

    const products = await Product.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    }).lean();

    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
