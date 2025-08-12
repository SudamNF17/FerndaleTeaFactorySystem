import React from "react";
import { Route, Routes} from "react-router";
import "./App.css";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Welcome from "./Components/Welcome/Welcome";
import HRDashboard from "./Components/Dashboards/HRDashboard";
import SupplierDashboard from "./Components/Dashboards/SupplierDashboard";
import WholesalerDashboard from "./Components/Dashboards/WholesalerDashboard"
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import Delivery from "./Components/Delivery/Delivery";
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import Supplier from "./Components/Supplier/Supplier";

>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <Route path="/delivery-vans" element={<Delivery />} />
          

=======
          <Route path="/supplier" element={<Supplier />} />
>>>>>>> Stashed changes
=======
          <Route path="/supplier" element={<Supplier />} />
>>>>>>> Stashed changes
=======
          <Route path="/supplier" element={<Supplier />} />
>>>>>>> Stashed changes
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
