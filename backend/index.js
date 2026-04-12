require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 MongoDB Atlas connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
});

const User = mongoose.model("User", userSchema);

// Image storage config
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ API route (DB save added)
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, email } = req.body;

    const newUser = new User({
      name,
      email,
      image: req.file.filename,
    });

    await newUser.save();

    res.json({
      message: "Saved in MongoDB",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving data" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Static folder
app.use("/uploads", express.static("uploads"));

// Server start
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running`)
);