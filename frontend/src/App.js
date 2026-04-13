import React, { useState } from "react";
import axios from "axios";

function App() {
  const API = process.env.REACT_APP_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  // For preview & response
  const [preview, setPreview] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // preview image
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("image", image);

    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Uploaded Successfully 🚀");

      // Save response data (assume backend sends image URL)
      setUserData(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          {/* File Upload */}
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border rounded-lg p-2 cursor-pointer file:bg-indigo-500 file:text-white file:px-4 file:py-2 file:rounded-lg"
            required
          />

          {/* Image Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
          )}

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600"
          >
            Submit
          </button>

        </form>
      </div>

      {/* PROFILE CARD */}
      {userData && (
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
          
          <img
            src={userData.image || preview}
            alt="profile"
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-indigo-500"
          />

          <h3 className="text-xl font-bold mt-4 text-gray-800">
            {userData.name}
          </h3>

          <p className="text-gray-600">{userData.email}</p>

        </div>
      )}
    </div>
  );
}

export default App;