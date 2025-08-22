import React from "react";
import { NavLink } from "react-router-dom"; // use NavLink instead of Link
import "./nav.css";

const NavigationBar = () => {
  return (
    <nav className="nav-bar">
      <ul className="nav-list">
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
            to="/stock"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Inventory Tea Stock
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/inventory"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Supply Tea Leaves
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/deliveryDashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Delivery and Payment
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
