// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Welcome from "./Components/Welcome/Welcome";
import HRDashboard from "./Components/Dashboards/HRDashboard";
import SupplierDashboard from "./Components/Dashboards/SupplierDashboard";
import WholesalerDashboard from "./Components/Dashboards/WholesalerDashboard";
import Delivery from "./Components/Delivery/Delivery";
import Schedule from "./Components/Delivery/Schedule";
import Supplier from "./Components/Supplier/Supplier";


import Cart from "./Components/Order/Cart";
import Payment from "./Components/Order/Payment";
import Bill from "./Components/Order/Bill";
import Orderdashboard from "./Components/Order/Orderdashboard";

import DeliveryDashboard from "./Components/Delivery/deliveryDashboard";
import Raw from "./Components/Raw/Raw";
import Fresh from "./Components/Fresh/Fresh";

import Process from "./Components/Process/Process";


function App() {
  // Protected route for HR Manager
  const ProtectedHRRoute = ({ children }) => {
    const role = localStorage.getItem("userRole");
    if (role !== "HRManager") {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (

    
        
    


    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected HR Manager Dashboard */}
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedHRRoute>
              <HRDashboard />
            </ProtectedHRRoute>
          }
        />

        {/* Supplier & Wholesaler Dashboards */}
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/wholesaler-dashboard" element={<WholesalerDashboard />} />

        {/* Delivery & Supplier routes */}
        <Route path="/deliveryDashboard" element={<DeliveryDashboard />} />
        <Route path="/delivery-vans" element={<Delivery />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/supplier" element={<Supplier />} />

        {/* Order routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/bill/:id" element={<Bill />} />
        <Route path="/orderdashboard" element={<Orderdashboard />} />

        {/* Raw & Fresh routes */}
        <Route path="/raw" element={<Raw />} />
        <Route path="/fresh" element={<Fresh />} />

          <Route path="/supplier" element={<Supplier />} />
          <Route path="/raw" element={<Raw />} />
          <Route path="/fresh" element={<Fresh />} />
          <Route path="/process" element={<Process/>} />

        {/* Redirect unknown routes to Welcome */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
