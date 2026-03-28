import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware (very important)
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("DealDrop+ API Running");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});