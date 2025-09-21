// src/Components/Delivery/DeliveryDashboard.js
import React, { useEffect, useState } from "react";
// useEffect → to fetch data when component loads
// useState → to store data in state variables

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import "./deliveryDashboard.css";
import Nav from "../Nav/Nav";

// Chart.js modules
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

// Register chart.js modules
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
  //clears user data and navigates to login
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  // store delivery vans data from backend
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
      {/*Header with user name and logout button */}
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Welcome Manager, {userName}</h2>
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

      <Nav/>

     <div className="scroll-header">
      <h3>Delivery Dashboard</h3>
      <div className="marquee">
        <div className="marquee-content">
          <span>🚚Here you can manage delivery vans and schedules. &nbsp;&nbsp;&nbsp;</span>
          <span>🚚Here you can manage delivery vans and schedules. &nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>
    </div>

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

{/* Analytics + Calendar */}
<div className="dashboard-analytics">
  <h3>📊 Delivery Analytics & Schedule</h3>

  <div className="charts-row">
    <div className="chart-card pie-chart">
      <h4>Status Distribution</h4>
      <Pie data={pieData} />
    </div>

    <div className="chart-card bar-chart">
      <h4>Deliveries per Person</h4>
      <Bar data={barData} />
    </div>

    <div className="chart-card calendar-card">
      <h4>📅 Delivery Calendar</h4>
      <Calendar />
    </div>
  </div>
</div>

{/* Factory Details */}
<div className="factory-details">
  <h3>🏭 Factory Details</h3>
  <div className="factory-cards">
    <div className="factory-card">
      <h4>Factory Name</h4>
      <p>Ferndale Tea Factory</p>
    </div>
    <div className="factory-card">
      <h4>Location</h4>
      <p>Balangoda, Sri Lanka</p>
    </div>
    <div className="factory-card">
      <h4>Established</h4>
      <p>1965</p>
    </div>
    <div className="factory-card">
      <h4>Total Employees</h4>
      <p>100</p>
    </div>
    <div className="factory-card">
      <h4>Active Vans</h4>
      <p>{vans.filter(v => v.availability_status !== "Unavailable").length}</p>
    </div>
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
