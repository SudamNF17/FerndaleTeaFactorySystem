import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import axios from "axios";
import "./HRDashboard.css";

const HRDashboard = () => {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", email: "", role: "" });
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setShowUsers(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users.");
    }
  };

  const handleToggleUsers = () => {
    if (!showUsers) {
      fetchUsers();
    } else {
      setShowUsers(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ fullName: user.fullName, email: user.email, role: user.role });
  };

  const handleCancel = () => setEditingUser(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingUser}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <Nav />
      <br />

      {/* Toggle button */}
      <button onClick={handleToggleUsers} className="view-users-btn">
        {showUsers ? "Hide Registered Users" : "View Registered Users"}
      </button>

      {showUsers && (
        <>
          <h3>Registered Users</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button onClick={() => handleEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingUser && (
            <div className="edit-modal">
              <h3>Edit User</h3>
              <form onSubmit={handleUpdate}>
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <label>Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="HRManager">HR Manager</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Wholesaler">Wholesaler</option>
                </select>
                <br />
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HRDashboard;
