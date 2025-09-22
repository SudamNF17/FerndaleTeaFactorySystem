import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilePdf, FaSave, FaUndo } from "react-icons/fa";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./DepartmentDashboard.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";



const COLORS = ["#0088FE", "#FF8042"];

const DepartmentDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [newDept, setNewDept] = useState({ name: "", employees: 0, performanceThisMonth: 50, performanceLastMonth: 30 });
  const [editingDept, setEditingDept] = useState(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
  // Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Department
  const addDepartment = async () => {
    if (!newDept.name) return alert("Enter department name!");
    try {
      const res = await axios.post("http://localhost:5000/api/departments", newDept);
      setDepartments([...departments, res.data]);
      setNewDept({ name: "", employees: 0, performanceThisMonth: 50, performanceLastMonth: 30 });
    } catch (err) {
      console.error(err);
    }
  };

  // Update Department
  const updateDepartment = async (id) => {
    if (!editingDept.name) return alert("Department name cannot be empty!");
    if (editingDept.employees < 0) return alert("Employees cannot be negative!");
    if (editingDept.performanceThisMonth < 0 || editingDept.performanceThisMonth > 100 ||
        editingDept.performanceLastMonth < 0 || editingDept.performanceLastMonth > 100) {
      return alert("Performance must be between 0 and 100!");
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/departments/${id}`, editingDept);
      setDepartments(departments.map((d) => (d._id === id ? res.data : d)));
      setEditingDept(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Department
  const deleteDepartment = async (id) => {
    if (window.confirm("Delete this department?")) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`);
        setDepartments(departments.filter((d) => d._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

 const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Department Report", 20, 15);

  // Create table
  doc.autoTable({
    startY: 25,
    head: [["Name", "Employees", "This Month", "Last Month"]],
    body: departments.map((d) => [
      d.name,
      d.employees,
      `${d.performanceThisMonth}%`, // arrow will be added in didDrawCell
      `${d.performanceLastMonth}%`,
    ]),
    headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: { fontSize: 11 },
    didDrawCell: (data) => {
      // Add trend arrow in "This Month" column (index 2)
      if (data.column.index === 2 && data.cell.section === "body") {
        const dept = departments[data.row.index];
        const trend = dept.performanceThisMonth - dept.performanceLastMonth;

        // ASCII arrow for reliability
        const arrow = trend > 0 ? "^" : trend < 0 ? "v" : "-";
        const color = trend > 0 ? [0, 128, 0] : trend < 0 ? [255, 0, 0] : [0, 0, 0];

        // Draw the arrow at right side of cell
        doc.setTextColor(...color);
        doc.text(
          arrow,
          data.cell.x + data.cell.width - 10,
          data.cell.y + data.cell.height / 1.8
        );
        doc.setTextColor(0, 0, 0); // reset color
      }
    },
  });

  doc.save("departments.pdf");
};



  return (
    <div className="dept-container">
       {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        <Nav />
      <div className="dept-header">
        <h1>Departments</h1>
<button className="pdf-btn" onClick={exportPDF}>
  <FaFilePdf /> Export PDF
</button>
        {/* ✅ Add Refresh Performance button */}
    <button
      className="refresh-btn"
      onClick={async () => {
        try {
          const res = await axios.put(
            "http://localhost:5000/api/departments/update-performance/all"
          );
          setDepartments(res.data);
        } catch (err) {
          console.error(err);
        }
      }}
    >
      Refresh Performance
    </button>
      </div>

      


      {/* Search */}
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add New */}
      <div className="add-form">
        <input type="text" placeholder="Department Name" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} />
        <input type="number" placeholder="Employees" value={newDept.employees} onChange={(e) => setNewDept({ ...newDept, employees: parseInt(e.target.value) || 0 })} />
        <input type="number" placeholder="This Month (%)" value={newDept.performanceThisMonth} onChange={(e) => setNewDept({ ...newDept, performanceThisMonth: parseInt(e.target.value) || 0 })} />
        <input type="number" placeholder="Last Month (%)" value={newDept.performanceLastMonth} onChange={(e) => setNewDept({ ...newDept, performanceLastMonth: parseInt(e.target.value) || 0 })} />
        <button onClick={addDepartment}><FaPlus /> Add</button>
      </div>

      {/* Department Table */}
      <table className="dept-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employees</th>
            <th>This Month</th>
            <th>Last Month</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments
            .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
            .map((dept) => (
              <tr key={dept._id}>
                <td>
                  {editingDept && editingDept._id === dept._id ? (
                    <input type="text" value={editingDept.name} onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })} />
                  ) : (
                    dept.name
                  )}
                </td>
                <td>
                  {editingDept && editingDept._id === dept._id ? (
                    <input type="number" value={editingDept.employees} onChange={(e) => setEditingDept({ ...editingDept, employees: parseInt(e.target.value) || 0 })} />
                  ) : (
                    dept.employees
                  )}
                </td>
                <td>
                  {editingDept && editingDept._id === dept._id ? (
                    <input type="number" value={editingDept.performanceThisMonth} onChange={(e) => setEditingDept({ ...editingDept, performanceThisMonth: parseInt(e.target.value) || 0 })} />
                  ) : (
                    dept.performanceThisMonth
                  )}
                </td>
                <td>
                  {editingDept && editingDept._id === dept._id ? (
                    <input type="number" value={editingDept.performanceLastMonth} onChange={(e) => setEditingDept({ ...editingDept, performanceLastMonth: parseInt(e.target.value) || 0 })} />
                  ) : (
                    dept.performanceLastMonth
                  )}
                </td>
                <td>
                  {editingDept && editingDept._id === dept._id ? (
                    <>
                      <button onClick={() => updateDepartment(dept._id)}><FaSave /> Save</button>
                      <button onClick={() => setEditingDept(null)}><FaUndo /> Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingDept(dept)}><FaEdit /> Edit</button>
                      <button onClick={() => deleteDepartment(dept._id)}><FaTrash /> Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pie Charts */}
      <div className="chart-section">
        <h2>Performance Comparison</h2>
        <div className="chart-grid">
          {departments.map((dept) => (
            <div key={dept._id} className="chart-card">
              <h3>{dept.name}</h3>
              <PieChart width={250} height={250}>
                <Pie
                  data={[
                    { name: "This Month", value: dept.performanceThisMonth },
                    { name: "Last Month", value: dept.performanceLastMonth },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
