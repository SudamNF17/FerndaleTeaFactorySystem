import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./delivery.css";
import { useNavigate } from "react-router-dom";
import VanTracker from "./VanTracker";

const API_URL = "http://localhost:5000/api/delivery-vans"; // change if needed

function Delivery() {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVan, setSelectedVan] = useState(null);

  const handleTrack = (van) => {
    setSelectedVan(van);
  };

  // For add/edit form
  const initialFormState = {
    delivery_person_id: "",
    name: "",
    phone_number: "",
    email: "",
    van_number: "",
    availability_status: "Available",
    notes: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  //  errors state
  const [errors, setErrors] = useState({});

  // validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.delivery_person_id || formData.delivery_person_id <= 0) {
      newErrors.delivery_person_id =
        "Delivery Person ID must be a positive number.";
    }

    if (!/^[a-zA-Z\s]{2,100}$/.test(formData.name)) {
      newErrors.name =
        "Name must be 2-100 characters, letters and spaces only.";
    }

    if (!/^\+?[0-9]{10}$/.test(formData.phone_number)) {
      newErrors.phone_number =
        "Phone number must be 10 digits, optional leading +.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

   if (!/^[a-zA-Z0-9-]{1,20}$/.test(formData.van_number)) {
  newErrors.van_number = "Van Number must be alphanumeric (max 20 chars).";
}


    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = "Notes cannot exceed 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  // Fetch vans
  const fetchVans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setVans(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch vans");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVans();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new van
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; //  validation check
    try {
      await axios.post(API_URL, {
        ...formData,
        delivery_person_id: Number(formData.delivery_person_id),
      });
      setFormData(initialFormState);
      fetchVans();
    } catch (err) {
      alert("Failed to add van. Make sure delivery_person_id is unique.");
    }
  };

  // Prepare edit form
  const handleEditClick = (van) => {
    setIsEditing(true);
    setEditId(van._id);
    setFormData({
      delivery_person_id: van.delivery_person_id,
      name: van.name,
      phone_number: van.phone_number,
      email: van.email,
      van_number: van.van_number,
      availability_status: van.availability_status,
      notes: van.notes || "",
    });
  };

  // Update van
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; //  validation check
    try {
      await axios.put(`${API_URL}/${editId}`, {
        ...formData,
        delivery_person_id: Number(formData.delivery_person_id),
      });
      setIsEditing(false);
      setEditId(null);
      setFormData(initialFormState);
      fetchVans();
    } catch (err) {
      alert("Failed to update van.");
    }
  };

  // Delete van
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this van?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchVans();
      } catch (err) {
        alert("Failed to delete van.");
      }
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Delivery Vans Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const headers = [
      ["ID", "Name", "Phone", "Email", "Van Number", "Status", "Notes"],
    ];

    const data = vans.map((van) => [
      van.delivery_person_id,
      van.name,
      van.phone_number,
      van.email,
      van.van_number,
      van.availability_status,
      van.notes || "",
    ]);

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: data,
    });

    doc.save("delivery_vans_report.pdf");
  };

  if (loading) return <p>Loading vans...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="delivery-container">
      <div className="dashboard-header">
        <h2>Welcome HR Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div style={{ padding: "20px" }}>
        <button
          className="back-button"
          onClick={() => navigate("/deliveryDashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="dashboard-buttons">
        <div className="fancy-button" onClick={() => navigate("/schedule")}>
          <h3>🚚 Delivery Schedule</h3>
          <p>Click here to manage schedules!</p>
        </div>
      </div>
      <h2>Delivery Vans List</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={generatePDF}>
          Generate PDF Report
        </button>
      </div>

      <table
        border="1"
        cellPadding="5"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Delivery Person</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Van Number</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vans.map((van) => (
            <tr key={van._id}>
              <td>{van.delivery_person_id}</td>
              <td>{van.name}</td>
              <td>{van.phone_number}</td>
              <td>{van.email}</td>
              <td>{van.van_number}</td>
              <td>{van.availability_status}</td>
              <td>{van.notes}</td>
              <td>
                <button onClick={() => handleEditClick(van)}>Edit</button>{" "}
                <button onClick={() => handleDelete(van._id)}>Delete</button>
                <button onClick={() => handleTrack(van)}>Track 🚐</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <VanTracker van={selectedVan} />

      <h3>{isEditing ? "Edit Van" : "Add New Van"}</h3>
      <form
        onSubmit={isEditing ? handleUpdate : handleAdd}
        style={{ marginTop: "20px" }}
      >
        <div>
          <label>Delivery Person ID:</label>
          <input
            type="number"
            name="delivery_person_id"
            value={formData.delivery_person_id}
            onChange={handleChange}
            required
          />
          {errors.delivery_person_id && (
            <p style={{ color: "red" }}>{errors.delivery_person_id}</p>
          )}
        </div>

        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={100}
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            pattern="^\+?[0-9]{7,15}$"
            title="Phone number must be 7 to 15 digits, optional leading +"
            required
          />
          {errors.phone_number && (
            <p style={{ color: "red" }}>{errors.phone_number}</p>
          )}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <label>Van Number:</label>
          <input
            type="text"
            name="van_number"
            value={formData.van_number}
            onChange={handleChange}
            maxLength={20}
            required
          />
          {errors.van_number && (
            <p style={{ color: "red" }}>{errors.van_number}</p>
          )}
        </div>

        <div>
          <label>Status:</label>
          <select
            name="availability_status"
            value={formData.availability_status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="On Delivery">On Delivery</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div>
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
          {errors.notes && <p style={{ color: "red" }}>{errors.notes}</p>}
        </div>

        <button type="submit">{isEditing ? "Update Van" : "Add Van"}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData(initialFormState);
              setEditId(null);
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-left">
          <p>
            © 2025 <strong>Ferndale Tea Factory</strong>
          </p>
          <p>All rights reserved.</p>
        </div>
        <div className="footer-right">
          <p>🍃 Tea Factory Management System</p>
        </div>
      </footer>
    </div>
  );
}

export default Delivery;
