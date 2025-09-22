import React from "react";
import { NavLink } from "react-router-dom"; // use NavLink instead of Link
import { Link } from "react-router-dom";  // ✅ add this

import "./nav.css";

const NavigationBar = () => {
  return (
    <nav className="nav-bar">
      <ul className="nav-list">
        <li><Link to="/employee-dashboard">Manage Employees</Link></li>
        <li><Link to="/stock">Inventory Tea Stock</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/inventory">supply Tea leaves</Link></li>
        <li><Link to="/delivery-vans">Delivery and Payment</Link></li>

        

        

        <li>
          <NavLink
            to="/hr-dashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          
          <NavLink
            to="/employees"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Manage Employees
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/inventory"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Inventory Tea Stock
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Orderdashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Orders
          </NavLink>
        </li>
        
        <li>
          <NavLink
            to="/deliveryDashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Delivery Management
          </NavLink>
        </li>
                <li><Link to="/Process">Process Management</Link></li>


      </ul>
    </nav>
  );
};

export default NavigationBar;
