/*import React, { useState } from "react";
import axios from "axios";

// ✅ Default export
export default function RegisterFace() {
  const [employeeId, setEmployeeId] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return setStatus("Enter employeeId");
    if (!file) return setStatus("Choose an image file");

    try {
      setStatus("Converting image...");
      const base64 = await toBase64(file);
      setStatus("Uploading and registering...");

      const res = await axios.post("/api/attendance/register-face", { employeeId, image: base64 }, { timeout: 30000 });
      setStatus(res.data.message || "Registered");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h3>Register Face</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        </div>
        <div>
          <label>Image (front face):</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="submit">Register Face</button>
      </form>
      <p>{status}</p>
    </div>
  );
}*/
