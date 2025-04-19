import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // add db import
import { doc, setDoc } from "firebase/firestore"; // import Firestore functions
import axios from "axios";
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

      // Step 2: Save additional info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        name: formData.name,
        year: formData.year,
        branch: formData.branch,
      });

      // Step 3: Send user data to your Spring Boot backend (without password)
      const res = await axios.post("http://localhost:8080/api/users/signup", {
        email: formData.email,
        name: formData.name,
        year: formData.year,
        branch: formData.branch,
      });

      if (res.status === 200) {
        alert("Signup successful!");
      } else {
        setError("Error saving user data to backend.");
      }
    } catch (err) {
      console.error("Signup Error:", err.message);
      setError("Signup failed. Please try again.");
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
