import React from "react";
import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mainhome" element={<Home />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
