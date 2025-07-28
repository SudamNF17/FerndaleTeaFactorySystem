import React, { useState } from 'react';
import './register.css';
import logo from '../../assets/tea-logo.png'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Supplier'); // Corrected initial role

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        fullName,
        email,
        password,
        role
      });
      alert("Registration successful ✅");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <img src={logo} alt="Ferndale Tea Logo" className="register-logo" />
        <h1>Welcome to Ferndale Tea Factory</h1>
        <p>Manage your employees, inventory, and orders efficiently 🍃</p>
      </div>

      <div className="register-right">
        <div className="register-card">
          <h2>Create an Account</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Manage1"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="manage1ferndale@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="Supplier">Supplier</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="HRManager">HR Manager</option>
              </select>
            </div>
            <button type="submit" className="register-btn">Register</button>
          </form>
          <p className="login-link">Already registered? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
