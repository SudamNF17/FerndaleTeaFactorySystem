import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Auth & Welcome
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Welcome from "./Components/Welcome/Welcome";

// Dashboards
import HRDashboard from "./Components/Dashboards/HRDashboard";
import SupplierDashboard from "./Components/Dashboards/SupplierDashboard";
import WholesalerDashboard from "./Components/Dashboards/WholesalerDashboard";
import EmployeeDashboard from "./Components/Employee/Dashboard";

// Employee
import EmployeeList from "./Components/Employee/EmployeeList";
import EmployeeProfile from "./Components/Employee/EmployeeProfile";
import AttendancePage from "./Components/Employee/AttendancePage";
import DepartmentsPage from "./Components/Employee/DepartmentDashboard";

// Delivery
import Delivery from "./Components/Delivery/Delivery";
import Schedule from "./Components/Delivery/Schedule";
import DeliveryDashboard from "./Components/Delivery/deliveryDashboard";
import Supplier from "./Components/Supplier/Supplier";

// Inventory
import Inventory from "./Components/Inventory/inventory";
import AddSupply from "./Components/Inventory/addsupply";
import AddProduct from "./Components/Inventory/addproduct";
import AddRawMaterial from "./Components/Inventory/AddRawMaterial";
import AddFreshTeaLeaves from "./Components/Inventory/AddFreshTeaLeaves";

// Orders
import Cart from "./Components/Order/Cart";
import Payment from "./Components/Order/Payment";
import Bill from "./Components/Order/Bill";
import Orderdashboard from "./Components/Order/Orderdashboard";

// Other
import Raw from "./Components/Raw/Raw";
import Fresh from "./Components/Fresh/Fresh";
import Process from "./Components/Process/Process";

function App() {
  // Protected route for HR Manager
  const ProtectedHRRoute = ({ children }) => {
    const role = localStorage.getItem("userRole");
    return role === "HRManager" ? children : <Navigate to="/login" replace />;
  };

  return (
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

      {/* Employee routes */}
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employees/:id" element={<EmployeeProfile />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/departments" element={<DepartmentsPage />} />

      {/* Inventory routes */}
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/add-supply" element={<AddSupply />} />
      <Route path="/inventory/add-supply/raw-materials" element={<AddRawMaterial />} />
      <Route path="/inventory/add-supply/fresh-tea-leaves" element={<AddFreshTeaLeaves />} />
      <Route path="/inventory/add-product" element={<AddProduct />} />

      {/* Order routes */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/bill/:id" element={<Bill />} />
      <Route path="/orderdashboard" element={<Orderdashboard />} />

      {/* Raw, Fresh & Process routes */}
      <Route path="/raw" element={<Raw />} />
      <Route path="/fresh" element={<Fresh />} />
      <Route path="/process" element={<Process />} />

      {/* Redirect unknown routes to Welcome */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
