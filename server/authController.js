// server/authController.js
const { UserModel } = require("./models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "your_secret_key"; // use dotenv in production

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.create({ email, password: hashed });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    res.json({ valid: true, userId: decoded.userId });
  } catch {
    res.status(401).json({ valid: false });
  }
};
