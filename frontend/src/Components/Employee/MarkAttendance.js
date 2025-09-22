/*import React, { useState, useRef } from "react";
import axios from "axios";

// ✅ Default export
export default function MarkAttendance() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const videoRef = useRef();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const startCamera = async () => {
    setStatus("Starting camera...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      setStatus("Camera error: " + err.message);
    }
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
    setStatus("Captured image. Sending...");
    await sendImage(base64);
  };

  const sendImage = async (base64) => {
    try {
      const res = await axios.post("/api/attendance/mark-attendance", { image: base64 }, { timeout: 30000 });
      setStatus(res.data.message || "Attendance marked");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || err.message);
    }
  };

  const handleFile = async () => {
    if (!file) return setStatus("Choose a file");
    setStatus("Uploading file...");
    const base64 = await toBase64(file);
    await sendImage(base64);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h3>Mark Attendance (Face)</h3>

      <div>
        <h4>Upload image</h4>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFile}>Send</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Or use Camera</h4>
        <video ref={videoRef} width="480" height="360" style={{ border: "1px solid #ccc" }} />
        <div>
          <button onClick={startCamera}>Start Camera</button>
          <button onClick={captureFromCamera}>Capture & Send</button>
        </div>
      </div>

      <p>{status}</p>
    </div>
  );
} */
