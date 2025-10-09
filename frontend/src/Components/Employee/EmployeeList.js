import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeList.css"; // Make sure you include the CSS provided earlier
import Nav from "../Nav/Nav";

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
    const userName = localStorage.getItem("userName");
  
  
  
    
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };

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
    <div className="employee-container">
       {/* Header */}
         
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <Nav />
      <h1>Employees</h1>

      {/* Toggle Add Employee Form */}
      <button
        className="add-employee-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Employee"}
      </button>

      {/* Inline Add Employee Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="empId"
              value={newEmployee.empId}
              onChange={handleChange}
              placeholder="Employee ID"
              required
            />
            <input
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              name="email"
              value={newEmployee.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              name="contact"
              value={newEmployee.contact}
              onChange={handleChange}
              placeholder="Contact"
            />
            <input
              name="address"
              value={newEmployee.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <input
              name="department"
              value={newEmployee.department}
              onChange={handleChange}
              placeholder="Department"
            />
            <select
              name="type"
              value={newEmployee.type}
              onChange={handleChange}
            >
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
            </select>
            <input
              name="jobRole"
              value={newEmployee.jobRole}
              onChange={handleChange}
              placeholder="Job Role"
            />
            <input
              name="description"
              value={newEmployee.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>
          <button type="submit" className="submit-employee-btn">
            Add Employee
          </button>
        </form>
      )}

      {/* Search Input */}
      <input
        type="text"
        placeholder="🔍 Search by name or ID"
        className="employee-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Employee Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr
              key={emp._id}
              onClick={() => navigate(`/employees/${emp._id}`)}
            >
              <td>{emp.empId}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
