import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EmployeeProfile.css";


const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch single employee
  useEffect(() => {
    fetch(`http://localhost:5000/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
        setFormData(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!employee) return <div className="p-6">Loading...</div>;

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update employee
  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setEmployee(updated);
        setEditing(false);
        alert("Employee updated successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete employee
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Employee deleted successfully");
        navigate("/employees");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
      <div className="space-y-2">
        <label>ID:</label>
        <input
          name="empId"
          value={formData.empId}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />

        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />

        <label>Email:</label>
        <input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />

        <label>Contact:</label>
        <input
          name="contact"
          value={formData.contact || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />

        <label>Address:</label>
        <input
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />

        <label>Department:</label>
        <input
          name="department"
          value={formData.department || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />

        <label>Type:</label>
        <select
          name="type"
          value={formData.type || "Permanent"}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        >
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
        </select>

        <label>Job Role:</label>
        <input
          name="jobRole"
          value={formData.jobRole || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          disabled={!editing}
        />
      </div>

      <div className="flex mt-4 gap-4">
        {!editing ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleUpdate}
          >
            Save
          </button>
        )}

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete
        </button>

        {editing && (
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
