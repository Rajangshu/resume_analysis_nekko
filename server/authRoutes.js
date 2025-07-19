// server/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verify
} = require("./authController");

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verify);

module.exports = router;
