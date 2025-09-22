import React from "react";
import { Link } from "react-router-dom";
import "./nav.css"; // import CSS file

const NavigationBar = () => {
  return (
    <nav className="nav-bar">
      <ul className="nav-list">
        <li><Link to="/employees">Manage Employees</Link></li>
        <li><Link to="/inventory">Inventory Tea Stock</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/inventory">supply Tea leaves</Link></li>
        <li><Link to="/delivery-vans">Delivery and Payment</Link></li>
        
      </ul>
    </nav>
  );
};

export default NavigationBar;
