import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { registerUser } from "../api"; // <-- Import the new API function
import "./signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    year: "",
    branch: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Step 2: Register user in your backend (with Firebase UID)
      const res = await registerUser({
        firebaseUid: user.uid,
        email: formData.email,
        name: formData.name,
        year: formData.year,
        branch: formData.branch,
      });

      if (res && res.id) {
        alert("Signup successful!");
      } else {
        setError("Error saving user data to backend.");
      }
    } catch (err) {
      // Firebase or backend error
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else if (err.response && err.response.status === 409) {
        setError("User already exists in the backend.");
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;