import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AttendancePage.css";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

const AttendancePage = () => {

const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => videoRef.current.srcObject = stream)
      .catch(err => console.error(err));

    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attendance`);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    return canvasRef.current.toDataURL("image/jpeg").split(",")[1];
  };

  const handleRegister = async () => {
    if (!empId || !name) { setMessage("Enter ID & Name"); return; }
    const image = captureImage();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/attendance/register-face`, { empId, name, image });
      setMessage(res.data.message);
      setEmpId(""); setName("");
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering face");
    }
  };

  const handleMarkAttendance = async () => {
    const image = captureImage();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/attendance/mark-attendance`, { image });
      setMessage(res.data.message);
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error marking attendance");
    }
  };

  return (
    <div className="attendance-container">

       {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="scroll-header">
        <h3>Employee Dashboard</h3>
        <div className="marquee">
          <div className="marquee-content">
            <span>
              👩‍💼Manage employee records and attendance. &nbsp;&nbsp;&nbsp;
            </span>
            <span>
              👩‍💼Manage employee records and attendance. &nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
      <h2>Face Attendance System</h2>

      <video ref={videoRef} width="300" height="300" autoPlay />
      <canvas ref={canvasRef} width="300" height="300" style={{ display: "none" }} />

      <div className="form-section">
        <h3>Register Employee</h3>
        <input placeholder="Employee ID" value={empId} onChange={e => setEmpId(e.target.value)} />
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={handleRegister}>Register Face</button>
      </div>

      <div className="form-section">
        <h3>Mark Attendance</h3>
        <button onClick={handleMarkAttendance}>Mark via Face</button>
      </div>

      {message && <p className="message">{message}</p>}

      <h3>Attendance Records</h3>
      <table>
        <thead>
          <tr><th>Emp ID</th><th>Name</th><th>Logs</th></tr>
        </thead>
        <tbody>
          {attendance.map(a => (
            <tr key={a._id}>
              <td>{a.empId}</td>
              <td>{a.name}</td>
              <td>{a.logs.map((log,i) => (<div key={i}>{log.status} - {new Date(log.date).toLocaleString()}</div>))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
