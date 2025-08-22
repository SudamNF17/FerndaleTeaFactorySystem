import React from "react";
import { Route, Routes } from "react-router";
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
import DeliveryDashboard from "./Components/Delivery/deliveryDashboard";
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
           <Route path="/deliveryDashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery-vans" element={<Delivery />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/supplier" element={<Supplier />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
