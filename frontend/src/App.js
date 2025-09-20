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
import Supplier from "./Components/Supplier/Supplier";
import EmployeeDashboard from "./Components/Employee/Dashboard";
import EmployeeList from "./Components/Employee/EmployeeList";
import EmployeeProfile from "./Components/Employee/EmployeeProfile";
import AttendancePage from "./Components/Employee/AttendancePage";
import DepartmentsPage from "./Components/Employee/DepartmentDashboard"

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
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                  <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeProfile />} />
          <Route path="/attendance" element={<AttendancePage/>}/>
          <Route path="/departments" element={<DepartmentsPage />} />

          
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
