"use client";
import { useState } from 'react';

export default function UserDataForm() {
  // State to store the form inputs
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');

  // State to store the updated data that we want to display
  const [updatedData, setUpdatedData] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you can call an API to update the data, or just store it locally
    const userData = { image, name, age, gender, country };

    // Updating the data to display (This would usually be saved to the backend)
    setUpdatedData(userData);

    // Optionally, clear the form after submission
    setImage('');
    setName('');
    setAge('');
    setGender('');
    setCountry('');
  };

  return (
    <div>
      {/* Form for user input */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>

      {/* Display updated data */}
      {updatedData && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Updated Data</h3>
          <p><strong>Image:</strong> <img src={updatedData.image} alt="User Image" width="100" /></p>
          <p><strong>Name:</strong> {updatedData.name}</p>
          <p><strong>Age:</strong> {updatedData.age}</p>
          <p><strong>Gender:</strong> {updatedData.gender}</p>
          <p><strong>Country:</strong> {updatedData.country}</p>
        </div>
      )}
    </div>
  );
}
