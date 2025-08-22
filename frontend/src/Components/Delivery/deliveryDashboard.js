// src/Components/Delivery/DeliveryDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import "./deliveryDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DeliveryDashboard = () => { 
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // State for vans data
  const [vans, setVans] = useState([]);

  // Fetch vans from backend
  useEffect(() => {
    const fetchVans = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/delivery-vans");
        setVans(res.data);
      } catch (err) {
        console.error("Failed to fetch vans", err);
      }
    };
    fetchVans();
  }, []);

  // Prepare chart data
  const statusCounts = vans.reduce((acc, van) => {
    acc[van.availability_status] = (acc[van.availability_status] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: ["Available", "On Delivery", "Unavailable"],
    datasets: [
      {
        label: "Delivery Status",
        data: [
          statusCounts["Available"] || 0,
          statusCounts["On Delivery"] || 0,
          statusCounts["Unavailable"] || 0
        ],
        backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"]
      }
    ]
  };

  const barData = {
    labels: vans.map(v => v.name),
    datasets: [
      {
        label: "Available",
        data: vans.map(v => v.availability_status === "Available" ? 1 : 0),
        backgroundColor: "#3498db"
      },
      {
        label: "On Delivery / Unavailable",
        data: vans.map(v => v.availability_status !== "Available" ? 1 : 0),
        backgroundColor: "#e67e22"
      }
    ]
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Welcome HR Manager, {userName}</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#e74c3c",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <h3>Delivery & Payment Dashboard</h3>
      <p>Here you can manage delivery vans and schedules.</p>

      {/* Dashboard Buttons */}
      <div className="dashboard-buttons">
        <div
          className="fancy-button"
          onClick={() => navigate("/schedule")}
        >
          <h3>🚚 Delivery Schedule</h3>
          <p>Click here to manage schedules!</p>
        </div>

        <div
          className="fancy-button"
          onClick={() => navigate("/delivery-vans")}
        >
          <h3>🚚 Delivery Lorry Details</h3>
          <p>Click here to manage Lorry Details!</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="dashboard-analytics" style={{ marginTop: "40px" }}>
        <h3>📊 Delivery Analytics</h3>

        <div style={{ maxWidth: "700px", margin: "20px auto" }}>
          <h4>Status Distribution</h4>
          <Pie data={pieData} />
        </div>

        <div style={{ maxWidth: "700px", margin: "20px auto" }}>
          <h4>Deliveries per Person</h4>
          <Bar data={barData} />
        </div>
      </div>

        <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
             ↑
        </button>
    </div>
    
  );
  
};

export default DeliveryDashboard;
