import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages / Dashboards
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Welcome from "./Components/Welcome/Welcome";
import HRDashboard from "./Components/Dashboards/HRDashboard";
import SupplierDashboard from "./Components/Dashboards/SupplierDashboard";
import WholesalerDashboard from "./Components/Dashboards/WholesalerDashboard";
import Delivery from "./Components/Delivery/Delivery";
import Supplier from "./Components/Supplier/Supplier";

// Inventory Components
import Inventory from "./Components/Inventory/inventory";
import AddSupply from "./Components/Inventory/addsupply";
import AddProduct from "./Components/Inventory/addproduct";

import AddRawMaterial from "./Components/Inventory/AddRawMaterial";
import AddFreshTeaLeaves from "./Components/Inventory/AddFreshTeaLeaves";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/wholesaler-dashboard" element={<WholesalerDashboard />} />
        <Route path="/delivery-vans" element={<Delivery />} />
        <Route path="/supplier" element={<Supplier />} />

        {/* Inventory routes */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/add-supply" element={<AddSupply />} />

        <Route path="/inventory/add-supply/raw-materials" element={<AddRawMaterial />} />
        <Route path="/inventory/add-supply/fresh-tea-leaves" element={<AddFreshTeaLeaves />} />

        <Route path="/inventory/add-product" element={<AddProduct />} />
      </Routes>
    </div>
  );
}

export default App;
