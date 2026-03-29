import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ➕ Add Product API
router.post("/add-product", async (req, res) => {
  try {
    const { name, price, location } = req.body;

    // simple risk logic
    let riskLevel = "low";
    if (price < 100) {
      riskLevel = "high";
    }

    const newProduct = new Product({
      name,
      price,
      location,
      riskLevel
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Get All Products API
router.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;