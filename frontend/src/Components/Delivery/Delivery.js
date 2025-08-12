import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import './delivery.css';
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";


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
    [
      "ID",
      "Name",
      "Phone",
      "Email",
      "Van Number",
      "Status",
      "Notes",
    ],
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
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        <Nav />
      <h2>Delivery Vans List</h2>

      <button onClick={generatePDF} style={{ marginBottom: "10px" }}>
        Generate PDF Report
      </button>

      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{isEditing ? "Edit Van" : "Add New Van"}</h3>
      <form onSubmit={isEditing ? handleUpdate : handleAdd} style={{ marginTop: "20px" }}>
        <div>
          <label>Delivery Person ID:</label>
          <input
            type="number"
            name="delivery_person_id"
            value={formData.delivery_person_id}
            onChange={handleChange}
            required
          />
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
    </div>
  );
}

export default Delivery;
