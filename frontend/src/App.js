import React, { useState } from "react";
import axios from "axios";

function App() {
  const API = process.env.REACT_APP_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("image", image);

    try {
      const res = await axios.post(`${API}/upload`, formData);
      alert("Uploaded Successfully 🚀");
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-600 mb-1">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border rounded-lg p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-indigo-500 file:text-white file:rounded-lg hover:file:bg-indigo-600"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
}

export default App;