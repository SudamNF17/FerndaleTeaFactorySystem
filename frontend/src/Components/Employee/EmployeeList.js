import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    empId: "",
    name: "",
    email: "",
    contact: "",
    address: "",
    department: "",
    type: "Permanent",
    jobRole: "",
    description: "",
  });
  const navigate = useNavigate();

  // Fetch all employees
  const fetchEmployees = () => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees by search term
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.empId.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form input change
  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Submit new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (res.ok) {
        setNewEmployee({
          empId: "",
          name: "",
          email: "",
          contact: "",
          address: "",
          department: "",
          type: "Permanent",
          jobRole: "",
          description: "",
        });
        setShowForm(false);
        fetchEmployees(); // refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      {/* Toggle Add Employee Form */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Employee"}
      </button>

      {/* Inline Add Employee Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border p-4 mb-6 bg-gray-50 rounded"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="empId"
              value={newEmployee.empId}
              onChange={handleChange}
              placeholder="Employee ID"
              className="border p-2"
              required
            />
            <input
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2"
              required
            />
            <input
              name="email"
              value={newEmployee.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2"
            />
            <input
              name="contact"
              value={newEmployee.contact}
              onChange={handleChange}
              placeholder="Contact"
              className="border p-2"
            />
            <input
              name="address"
              value={newEmployee.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2"
            />
            <input
              name="department"
              value={newEmployee.department}
              onChange={handleChange}
              placeholder="Department"
              className="border p-2"
            />
            <select
              name="type"
              value={newEmployee.type}
              onChange={handleChange}
              className="border p-2"
            >
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
            </select>
            <input
              name="jobRole"
              value={newEmployee.jobRole}
              onChange={handleChange}
              placeholder="Job Role"
              className="border p-2"
            />
            <input
              name="description"
              value={newEmployee.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            Add Employee
          </button>
        </form>
      )}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or ID"
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Employee Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Department</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr
              key={emp._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/employees/${emp._id}`)}
            >
              <td className="p-2 border">{emp.empId}</td>
              <td className="p-2 border">{emp.name}</td>
              <td className="p-2 border">{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
