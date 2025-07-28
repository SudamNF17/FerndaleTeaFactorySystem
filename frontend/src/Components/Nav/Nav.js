import React from "react";
import { Link } from "react-router-dom";
import "./nav.css"; // import CSS file

const NavigationBar = () => {
  return (
    <nav className="nav-bar">
      <ul className="nav-list">
        <li><Link to="/employees">Manage Employees</Link></li>
        <li><Link to="/stock">Inventory Tea Stock</Link></li>
        <li><Link to="/sales">Sales</Link></li>
        <li><Link to="/inventory">supply Tea leavves</Link></li>
        <li><Link to="/sales">Orders</Link></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
