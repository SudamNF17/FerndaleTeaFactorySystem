import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Lorry icon
const lorryIcon = new L.Icon({
  iconUrl: require("../../assets/lorry.png"),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

// Backend API
const API_URL = "http://localhost:5000/api/delivery-vans";

// Component to recenter map on location update
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

function VanTracker({ van }) {
  const [currentVan, setCurrentVan] = useState(van);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [mapType, setMapType] = useState("street"); // street, satellite, hybrid

  useEffect(() => {
    if (!van) return;

    // Immediate fetch
    setErrMsg("");
    setConnectionStatus("connecting");
    axios
      .get(`${API_URL}/${van._id}?t=${Date.now()}`)
      .then((res) => {
        setCurrentVan(res.data);
        setLastUpdated(new Date());
        setConnectionStatus("connected");
        setIsTracking(true);
      })
      .catch((err) => {
        console.log('Fetch error', err);
        setErrMsg('Failed to fetch van location');
        setConnectionStatus("error");
      });

    // Poll every 3 seconds for real-time updates
    const interval = setInterval(() => {
      axios
        .get(`${API_URL}/${van._id}?t=${Date.now()}`)
        .then((res) => {
          setCurrentVan(res.data);
          setLastUpdated(new Date());
          setConnectionStatus("connected");
          setIsTracking(true);
        })
        .catch((err) => {
          console.log('Poll error', err);
          setErrMsg('Failed to refresh van location');
          setConnectionStatus("error");
        });
    }, 3000);

    return () => {
      clearInterval(interval);
      setIsTracking(false);
      setConnectionStatus("disconnected");
    };
  }, [van]);

  if (!currentVan) {
    return <p style={{ marginTop: "20px", textAlign: "center" }}>🚐 Select a van to track its location</p>;
  }

  // Use latitude & longitude from your model (treat 0 as valid, coerce strings)
  const latRaw = currentVan.latitude;
  const lngRaw = currentVan.longitude;
  const latNum = typeof latRaw === 'string' ? parseFloat(latRaw) : latRaw;
  const lngNum = typeof lngRaw === 'string' ? parseFloat(lngRaw) : lngRaw;
  const hasCoords = typeof latNum === 'number' && typeof lngNum === 'number' && !Number.isNaN(latNum) && !Number.isNaN(lngNum);
  const position = hasCoords ? [latNum, lngNum] : [9.6615, 80.0255]; // default Jaffna
  
  const mapStyle = {
    height: "400px",
    width: "80%",
    maxWidth: "600px",
    margin: "20px auto",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    overflow: "hidden",
  };

  const handleTestMove = async () => {
    if (!van) return;
    try {
      const baseLat = hasCoords ? latNum : 9.6615;
      const baseLng = hasCoords ? lngNum : 80.0255;
      const newLat = baseLat + 0.001;
      const newLng = baseLng + 0.001;
      await axios.put(`${API_URL}/${van._id}/location`, {
        latitude: newLat,
        longitude: newLng,
      });
      const res = await axios.get(`${API_URL}/${van._id}?t=${Date.now()}`);
      setCurrentVan(res.data);
      setLastUpdated(new Date());
      setErrMsg("");
    } catch (e) {
      setErrMsg('Test move failed');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "#28a745";
      case "connecting": return "#ffc107";
      case "error": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected": return "🟢";
      case "connecting": return "🟡";
      case "error": return "🔴";
      default: return "⚪";
    }
  };

  const getMapLayer = () => {
    switch (mapType) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: "&copy; Esri"
        };
      case "hybrid":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: "&copy; Esri"
        };
      default: // street
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "&copy; OpenStreetMap contributors"
        };
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px", marginTop: "20px" }}>
        🚐 Tracking Van: {currentVan.van_number} <br />
        👤 Delivery Person: {currentVan.name || "N/A"}
      </div>

      <div style={{ textAlign: "center", marginTop: "8px", color: "#555" }}>
        Lat: {currentVan.latitude ?? '—'}, Lng: {currentVan.longitude ?? '—'}
        {lastUpdated && (
          <span> • Updated: {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "8px", color: getStatusColor(), fontSize: "14px", fontWeight: "bold" }}>
        {getStatusIcon()} {connectionStatus.toUpperCase()} {isTracking && "• LIVE TRACKING"}
      </div>

      <div style={{ textAlign: "center", marginTop: "8px", color: "#777", fontSize: "12px" }}>
        Van ID: {currentVan._id || '—'} • Driver ID: {currentVan.delivery_person_id || '—'}
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button onClick={handleTestMove} style={{ 
          padding: "8px 16px", 
          backgroundColor: "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px"
        }}>
          Test Move Van
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <h4 style={{ margin: "10px 0", color: "#333" }}>🗺️ Map Type:</h4>
        <button 
          onClick={() => setMapType("street")} 
          style={{ 
            padding: "6px 12px", 
            backgroundColor: mapType === "street" ? "#28a745" : "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer",
            margin: "0 5px"
          }}
        >
          🏘️ Street
        </button>
        <button 
          onClick={() => setMapType("satellite")} 
          style={{ 
            padding: "6px 12px", 
            backgroundColor: mapType === "satellite" ? "#28a745" : "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer",
            margin: "0 5px"
          }}
        >
          🛰️ Satellite
        </button>
        <button 
          onClick={() => setMapType("hybrid")} 
          style={{ 
            padding: "6px 12px", 
            backgroundColor: mapType === "hybrid" ? "#28a745" : "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer",
            margin: "0 5px"
          }}
        >
          🗺️ Hybrid
        </button>
      </div>

      {errMsg && (
        <div style={{ textAlign: "center", marginTop: "8px", color: "#c00", backgroundColor: "#f8d7da", padding: "8px", borderRadius: "4px" }}>
          ⚠️ {errMsg}
        </div>
      )}

      <div style={mapStyle}>
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url={getMapLayer().url}
            attribution={getMapLayer().attribution}
          />
          {mapType === "hybrid" && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri"
              opacity={0.7}
            />
          )}
          <Marker position={position} icon={lorryIcon}>
            <Popup>
              🚐 <b>{currentVan.name}</b> <br />
              Van: {currentVan.van_number} <br />
              Status: {currentVan.availability_status} <br />
              👤 Delivery Person: {currentVan.name} <br />
              📍 Lat: {currentVan.latitude?.toFixed(6)} <br />
              📍 Lng: {currentVan.longitude?.toFixed(6)}
            </Popup>
          </Marker>

          <RecenterMap position={position} />
        </MapContainer>
      </div>
    </div>
  );
}

export default VanTracker;
