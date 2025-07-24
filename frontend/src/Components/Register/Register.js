import React from 'react';
import './register.css';
import logo from '../../assets/tea-logo.png'; 

function Register() {
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
          <form className="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Manage1" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="manage1ferndale@gmail.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="********" required />
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
