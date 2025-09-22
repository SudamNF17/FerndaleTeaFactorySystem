import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaEnvelope,
  FaCalendarCheck,
} from "react-icons/fa";
import "./EmployeeDashboard.css";
import Nav from "../Nav/Nav";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sections = [
    {
      title: "Employees",
      desc: "View and manage all employees",
      color: "blue",
      icon: <FaUsers size={40} />,
      path: "/employees",
    },
    {
      title: "Departments",
      desc: "Department overview & stats",
      color: "yellow",
      icon: <FaBuilding size={40} />,
      path: "/departments",
    },
    {
      title: "Mail",
      desc: "Open company mail",
      color: "green",
      icon: <FaEnvelope size={40} />,
      action: () => window.open("https://mail.google.com", "_blank"),
    },
    {
      title: "Attendance",
      desc: "Manage employee attendance",
      color: "red",
      icon: <FaCalendarCheck size={40} />,
      path: "/attendance",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <Nav />
      <div className="scroll-header">
        <h3>Employee Dashboard</h3>
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
      <h1 className="dashboard-title">Employee Management</h1>

      <div className="dashboard-grid">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`dashboard-card bg-${section.color}`}
            onClick={() =>
              section.path ? navigate(section.path) : section.action()
            }
          >
            <div className="icon-wrapper">{section.icon}</div>
            <h2>{section.title}</h2>
            <p>{section.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
