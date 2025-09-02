import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Welcome from "./Components/Welcome/Welcome";
import HRDashboard from "./Components/Dashboards/HRDashboard";
import SupplierDashboard from "./Components/Dashboards/SupplierDashboard";
import WholesalerDashboard from "./Components/Dashboards/WholesalerDashboard";
import Delivery from "./Components/Delivery/Delivery";
import Supplier from "./Components/Supplier/Supplier";
<<<<<<< Updated upstream
import Fresh from "./Components/Fresh/Fresh";
import Raw from "./Components/Raw/Raw";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/hr-dashboard" element={<HRDashboard />} />
      <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      <Route path="/wholesaler-dashboard" element={<WholesalerDashboard />} />
      <Route path="/delivery-vans" element={<Delivery />} />
      <Route path="/supplier" element={<Supplier />} />
      <Route path="/raw" element={<Raw />} />
      <Route path="/fresh" element={<Fresh />} />
    </Routes>
=======
import Raw from "./Components/Raw/Raw";
import Fresh from "./Components/Fresh/Fresh"

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/wholesaler-dashboard" element={<WholesalerDashboard />} />
          <Route path="/delivery-vans" element={<Delivery />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/raw" element={<Raw />} />
          <Route path="/fresh" element={<Fresh />} />

        </Routes>
      </React.Fragment>
    </div>
>>>>>>> Stashed changes
  );
}

export default App;
