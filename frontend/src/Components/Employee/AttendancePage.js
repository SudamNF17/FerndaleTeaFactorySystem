import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AttendancePage.css"; // <-- Import CSS

const API_URL = "http://localhost:5000/api/attendance";

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({ empId: "", date: "", status: "Present" });
  const [editingId, setEditingId] = useState(null);

  // Fetch attendance records
  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ empId: "", date: "", status: "Present" });
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      empId: record.empId,
      date: record.date.split("T")[0],
      status: record.status,
    });
    setEditingId(record._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Employee Attendance Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="empId"
          placeholder="Employee ID"
          value={formData.empId}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id}>
              <td>{rec.empId}</td>
              <td>{new Date(rec.date).toLocaleDateString()}</td>
              <td>{rec.status}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(rec)}>
                  Edit
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(rec._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
