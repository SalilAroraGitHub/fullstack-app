require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Static folder (VERY IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log(err));

// ✅ Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
});

const User = mongoose.model("User", userSchema);

// ✅ Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Upload API
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, email } = req.body;

    // 🔥 FULL IMAGE URL
  const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    const newUser = new User({
      name,
      email,
      image: imageUrl,
    });

    await newUser.save();

    res.json({
      name: newUser.name,
      email: newUser.email,
      image: imageUrl,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving data" });
  }
});

// ✅ Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));