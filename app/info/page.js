"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function UserProfileForm() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    age: "",
    gender: "",
    country: "",
  });

  // Fetch user and existing Firestore data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle input changes (text/select)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload and convert to base64
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Save or update user profile in Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required");

    try {
      await setDoc(doc(db, "users", user.uid), formData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Error saving data");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>User Profile</h2>

      {user && <button onClick={() => signOut(auth)}>Logout</button>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
        <button type="submit">Save</button>
      </form>

      {/* Display saved data */}
      {formData.name && (
        <div style={{ marginTop: "30px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
          <h3>Saved Profile</h3>
          {formData.image && (
            <img src={formData.image} alt="User" style={{ width: "100px", borderRadius: "50%" }} />
          )}
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Age:</strong> {formData.age}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>
          <p><strong>Country:</strong> {formData.country}</p>
        </div>
      )}
    </div>
  );
}
