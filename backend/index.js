require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected 🚀"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

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


// 🔁 Get Access Token (Zoho)
async function getAccessToken() {
  try {
    console.log("🔄 Getting Zoho Access Token...");

    const res = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        },
      }
    );

    console.log("✅ Access Token Fetched");
    return res.data.access_token;

  } catch (err) {
    console.log("❌ Token Error:", err.response?.data || err.message);
    throw err;
  }
}


// 🟢 Upload API + Zoho Lead Create
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("📥 Request Received");

    const { name, email } = req.body;
    console.log("👉 Data:", { name, email });

    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    console.log("🖼 Image URL:", imageUrl);

    // ✅ Save in MongoDB
    const newUser = new User({ name, email, image: imageUrl });
    await newUser.save();
    console.log("✅ Saved in MongoDB");

    // 🔁 Token
    const accessToken = await getAccessToken();
    console.log("🔑 Access Token:", accessToken);

    // 🔥 Send to Zoho
    console.log("📤 Sending data to Zoho...");

    const zohoRes = await axios.post(
      "https://www.zohoapis.in/crm/v2/Leads",
      {
        data: [
          {
            Last_Name: name || "Default Name",
            Email: email,
            Company: "Website Lead",
            Description: `Image: ${imageUrl}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🚀 Zoho Response:", JSON.stringify(zohoRes.data, null, 2));

    res.json({
      success: true,
      message: "Saved to DB + Zoho 🚀",
    });

  } catch (err) {
    console.log("❌ FINAL ERROR:");
    console.log(err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});


// ✅ Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));