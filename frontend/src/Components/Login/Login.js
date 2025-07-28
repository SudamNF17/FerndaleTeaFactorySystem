import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
import logo from '../../assets/tea-logo.png'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const { role, fullName } = res.data;

      // Save to localStorage (for session)
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userRole", role);

      // Redirect based on role
      if (role === "HRManager") {
        navigate("/hr-dashboard");
      } else if (role === "Supplier") {
        navigate("/supplier-dashboard");
      } else if (role === "Wholesaler") {
        navigate("/wholesaler-dashboard");
      } else {
        alert("Unknown user role.");
      }

    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="Ferndale Tea Logo" className="login-logo" />
        <h1>Welcome Back to Ferndale Tea Factory</h1>
        <p>Manage your factory efficiently 🍃</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Login to Your Account</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="manage1ferndale@.com"
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
            <button type="submit" className="login-btn">Login</button>
          </form>
          <p className="register-link">Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
