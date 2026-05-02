import React, { useState } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";

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

  // 👉 Facebook Login Success
  const handleFacebookSuccess = async (response) => {
    console.log("Facebook Login Success:", response);

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/facebook-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
          userID: response.userID,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Facebook Login Successful");

        // Auto fill form
        setForm({
          name: data.name || "",
          email: data.email || "",
        });
      } else {
        alert("❌ Facebook login failed");
      }
    } catch (error) {
      console.log("Facebook Login Error:", error);
      alert("❌ Server error during Facebook login");
    }
  };

  // 👉 Facebook Login Fail
  const handleFacebookFail = (error) => {
    console.log("Facebook Login Failed:", error);
    alert("❌ Facebook login failed");
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

      {/* 👉 Facebook Login Button */}
      <FacebookLogin
        appId="1287400729626012"
         scope="public_profile,email"
        onSuccess={handleFacebookSuccess}
        onFail={handleFacebookFail}
        render={({ onClick }) => (
          <button
            onClick={onClick}
            style={{
              backgroundColor: "#1877F2",
              color: "#fff",
              padding: "10px",
              border: "none",
              cursor: "pointer",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            Login with Facebook
          </button>
        )}
      />

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