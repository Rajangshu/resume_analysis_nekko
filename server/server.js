require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB");
const routes = require("./routes"); // main app logic
const authRoutes = require("./authRoutes"); // ✅ auth APIs

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // adjust if frontend hosted elsewhere
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Route mount points
app.use("/api", routes); // all business logic (CV, JD, etc.)
app.use("/api/auth", authRoutes); // all auth logic

// Connect DB and start server
connectDB();

app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));
