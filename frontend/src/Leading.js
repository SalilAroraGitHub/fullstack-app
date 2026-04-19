import React, { useState } from "react";

const Leading = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 👉 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 👉 Handle file
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 👉 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("❌ Please select image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("image", image);

    try {
      // 🔥 ENV BASED URL
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("✅ Response:", data);

      if (res.ok) {
        alert("✅ Data sent to DB + Zoho 🚀");

        // reset form
        setForm({ name: "", email: "" });
        setImage(null);
      } else {
        alert("❌ Failed: " + (data.error || "Unknown error"));
      }

    } catch (err) {
      console.log("❌ Fetch Error:", err);
      alert("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Lead Form</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <input type="file" onChange={handleFileChange} />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Leading;