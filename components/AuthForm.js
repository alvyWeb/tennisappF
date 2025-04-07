"use client";

import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function UserProfileForm() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    age: "",
    gender: "",
    country: "",
  });

  // Fetch user from auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch existing data
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required");

    try {
      await setDoc(doc(db, "users", user.uid), formData);
      alert("Data updated successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
        <button type="submit">Save</button>
      </form>

      {formData.name && (
        <div style={{ marginTop: "20px" }}>
          <h3>Profile Info</h3>
          <img src={formData.image} alt="User" width="100" />
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Age:</strong> {formData.age}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>
          <p><strong>Country:</strong> {formData.country}</p>
        </div>
      )}
    </div>
  );
}
