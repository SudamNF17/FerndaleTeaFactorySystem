import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const lorryIcon = new L.Icon({
  iconUrl: require("../../assets/lorry.png"),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

function VanTracker({ van }) {
  // Default starting position (Colombo)
  const [position, setPosition] = useState(van?.location || [6.9271, 79.8612]);

  // Simulate movement when van is selected
  useEffect(() => {
    if (!van) return;

    const interval = setInterval(() => {
      setPosition((prev) => [
        prev[0] + (Math.random() - 0.5) * 0.001, // simulate latitude change
        prev[1] + (Math.random() - 0.5) * 0.001, // simulate longitude change
      ]);
    }, 3000); // update every 3 seconds

    return () => clearInterval(interval);
  }, [van]);

  if (!van) {
    return (
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        🚐 Select a van to track its location
      </p>
    );
  }

  const mapStyle = {
    height: "400px",
    width: "80%",
    maxWidth: "600px",
    margin: "20px auto",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    overflow: "hidden",
  };

  return (
    <div>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px", marginTop: "20px" }}>
        🚐 Tracking Van: {van.van_number} <br />
        👤 Delivery Person: {van.name}
      </div>

      <div style={mapStyle}>
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={position} icon={lorryIcon}>
            <Popup>
              🚐 <b>{van.name}</b> <br />
              Van: {van.van_number} <br />
              Status: {van.availability_status}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default VanTracker;
