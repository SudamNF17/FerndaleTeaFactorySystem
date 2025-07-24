import React from 'react';
import './login.css'; 
import logo from '../../assets/tea-logo.png'; 

function Login() {
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
          <form className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="manage1ferndale@.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="********" required />
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
