import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Process.css";
import printLogo from "../../assets/printlogo.png";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";


function Process() {

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");



  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [processes, setProcesses] = useState([]);
  const [formData, setFormData] = useState({
    processName: "",
    date: "",
    bopf1: "",
    bopf2: "",
    bopf3: "",
    bopf4: "",
    bopf5: "",
    bopf6: "",
    bopf7: "",
    bopf8: "",
    bopf9: "",
    bopf10: "",
    bopf11: "",
    bopf12: "",
    bopf13: "",
    bopf14: "",
    bopf15: "",
    dust: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProcesses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/processes");
      setProcesses(res.data.processes || []);
    } catch (err) {
      console.error("Error fetching processes:", err);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/processes/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/processes", formData);
      }
      setFormData({
        processName: "",
        date: "",
        bopf1: "",
        bopf2: "",
        bopf3: "",
        bopf4: "",
        bopf5: "",
        bopf6: "",
        bopf7: "",
        bopf8: "",
        bopf9: "",
        bopf10: "",
        bopf11: "",
        bopf12: "",
        bopf13: "",
        bopf14: "",
        bopf15: "",
        dust: "",
      });
      setEditingId(null);
      fetchProcesses();
    } catch (err) {
      console.error("Error saving process:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/processes/${id}`);
      fetchProcesses();
    } catch (err) {
      console.error("Error deleting process:", err);
    }
  };

  const handleEdit = (proc) => {
    setFormData(proc);
    setEditingId(proc._id);
  };

  // Print slip
  const handlePrint = (proc) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>Process Slip</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .print-container { width: 600px; margin: auto; border: 2px solid #333; padding: 20px; }
          .print-header { text-align: center; margin-bottom: 20px; }
          .print-header img { max-width: 150px; display: block; margin: 0 auto 10px auto; }
          .print-header h2 { margin: 0; font-size: 24px; }
          .process-info { margin-bottom: 20px; }
          .process-info p { margin: 5px 0; font-size: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <img src="${printLogo}" alt="Logo" />
            <h2>Process Slip</h2>
          </div>
          <div class="process-info">
            <p><strong>Process Name:</strong> ${proc.processName}</p>
            <p><strong>Date:</strong> ${new Date(proc.date).toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>BOPFs</th>
                <th>Dust</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  ${Array.from({ length: 15 }, (_, i) => `BOPF${i + 1}: ${proc[`bopf${i + 1}`]}<br>`).join('')}
                </td>
                <td>${proc.dust}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Gmail
  const handleEmail = (proc) => {
    const subject = "Process Data";
    const body =
      `Process Name: ${proc.processName}\n` +
      `Date: ${new Date(proc.date).toLocaleDateString()}\n` +
      Array.from({ length: 15 }, (_, i) => `BOPF${i + 1}: ${proc[`bopf${i + 1}`]}`).join("\n") +
      `\nDust: ${proc.dust}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="process-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
       
      </div>
     <Nav />
      
      <div className="scroll-header">
        <h3>Process Management</h3>
        <div className="marquee">
          <div className="marquee-content">
            <span>
              👩‍💼Manage employee records and attendance. &nbsp;&nbsp;&nbsp;
            </span>
            <span>
              👩‍💼Manage employee records and attendance. &nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
      <h1>Process Management</h1>

      <form onSubmit={handleSubmit} className="process-form">
        <input type="text" name="processName" placeholder="Process Name" value={formData.processName} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        {Array.from({ length: 15 }, (_, i) => (
          <input key={i} type="number" name={`bopf${i + 1}`} placeholder={`BOPF${i + 1} (kg)`} value={formData[`bopf${i + 1}`]} onChange={handleChange} required />
        ))}
        <input type="number" name="dust" placeholder="Dust (kg)" value={formData.dust} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update" : "Add"} Process</button>
      </form>

      <div className="table-wrapper">
        <table className="process-table">
          <thead>
            <tr>
              <th>Process Name</th>
              <th>Date</th>
              <th>BOPFs</th>
              <th>Dust</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc) => (
              <tr key={proc._id}>
                <td>{proc.processName}</td>
                <td>{new Date(proc.date).toLocaleDateString()}</td>
                <td>
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i}>BOPF{i + 1}: {proc[`bopf${i + 1}`]}</div>
                  ))}
                </td>
                <td>{proc.dust}</td>
                <td className="action-buttons">
                  <div className="buttons-vertical">
                    <button onClick={() => handleEdit(proc)}>Edit</button>
                    <button onClick={() => handleDelete(proc._id)}>Delete</button>
                    <button onClick={() => handlePrint(proc)}>Print</button>
                    <button onClick={() => handleEmail(proc)}>Gmail</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

           {/* Footer */}
<footer className="dashboard-footer">
  <div className="footer-left">
    <p>© 2025 <strong>Ferndale Tea Factory</strong></p>
    <p>All rights reserved.</p>
  </div>
  <div className="footer-right">
    <p>🍃 Tea Factory Management System</p>
  </div>
</footer>
    </div>
  );
}

export default Process;
