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
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/${id}`);
        const data = await res.json();
        setEmployee(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) return <div className="employee-container">Loading...</div>;

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
      alert("Update failed. Try again!");
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
      alert("Delete failed. Try again!");
    }
  };

  return (
    <div className="employee-container">
      <h1>Employee Details</h1>

      <div className="space-y-3">
        {["empId", "name", "email", "contact", "address", "department", "jobRole"].map((field) => (
          <div key={field}>
            <label className="font-semibold">{field === "empId" ? "ID" : field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              disabled={!editing}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}

        {/* Type Field */}
        <div>
          <label className="font-semibold">Type:</label>
          <select
            name="type"
            value={formData.type || "Permanent"}
            onChange={handleChange}
            disabled={!editing}
            className="border p-2 w-full rounded"
          >
            <option value="Permanent">Permanent</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description:</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            disabled={!editing}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex mt-4 gap-3">
        {!editing ? (
          <button
            className="bg-blue-500"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        ) : (
          <>
            <button
              className="bg-green-500"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-400"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </>
        )}
        <button
          className="bg-red-500"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfile;
