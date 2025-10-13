import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AddRawMaterial.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import sasLogo from "../../assets/saslogo.jpg";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to update map center dynamically
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    console.log("MapUpdater - Updating map center to:", center, "zoom:", zoom); // Debug log
    if (map && center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

const AddRawMaterial = () => {
  const API_URL = "http://localhost:5000/api/raw-materials";

  const [materials, setMaterials] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    supplierName: "",
    mobile: "",
    email: "",
    materialType: "",
    quantity: 0,
    pricePerUnit: 0,
    certification: "",
    factoryLocation: "",
    collectedLocationName: "",
    collectedLocation: { lat: 6.9271, lng: 79.8612 },
  });

  // Fetch all materials
  const fetchMaterials = async () => {
    try {
      const res = await axios.get(API_URL);
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^(?:\+94\d{9}|0\d{9})$/.test(mobile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmailError(validateEmail(value) ? "" : "Invalid email");
    if (name === "mobile")
      setMobileError(
        validateMobile(value)
          ? ""
          : "Invalid mobile (e.g. 0712345678 or +94712345678)"
      );

    setFormData({ ...formData, [name]: value });
  };

  // Fetch location name from OpenStreetMap
  const fetchLocationName = async (lat, lng) => {
    try {
      setLoadingLocation(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        collectedLocationName: data.display_name || "Unknown location",
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Search for cities as user types
  const searchCities = async (query) => {
    if (!query || query.length < 2) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchingCities(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )},Sri Lanka&format=json&limit=5&addressdetails=1`
      );
      const data = await res.json();
      
      // Filter and format suggestions
      const suggestions = data.map((item) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        city: item.address?.city || item.address?.town || item.address?.village || item.address?.county || item.name,
      }));
      
      setCitySuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (err) {
      console.error("Error searching cities:", err);
      setCitySuggestions([]);
    } finally {
      setSearchingCities(false);
    }
  };

  // Handle city selection from dropdown
  const handleCitySelect = (suggestion) => {
    console.log("Selected city:", suggestion); // Debug log
    console.log("Coordinates - Lat:", suggestion.lat, "Lng:", suggestion.lng); // Debug log
    
    // Ensure coordinates are valid numbers
    const newLat = parseFloat(suggestion.lat);
    const newLng = parseFloat(suggestion.lng);
    
    if (isNaN(newLat) || isNaN(newLng)) {
      console.error("Invalid coordinates:", suggestion);
      alert("Invalid location coordinates. Please try another city.");
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      collectedLocationName: suggestion.name,
      collectedLocation: { lat: newLat, lng: newLng },
    }));
    
    setShowSuggestions(false);
    setCitySuggestions([]);
    
    console.log("Updated location:", { lat: newLat, lng: newLng }); // Debug log
  };

  // Handle location input change with debounce
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      collectedLocationName: value,
    }));
    
    // Debounce the search
    if (window.locationSearchTimeout) {
      clearTimeout(window.locationSearchTimeout);
    }
    
    window.locationSearchTimeout = setTimeout(() => {
      searchCities(value);
    }, 300);
  };

  const handleMarkerDrag = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setFormData((prev) => ({
      ...prev,
      collectedLocation: { lat, lng },
    }));
    fetchLocationName(lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return alert("Please enter a valid email!");
    if (!validateMobile(formData.mobile)) return alert("Please enter a valid mobile number!");
    if (!formData.collectedLocationName) return alert("Please enter the collected location name!");

    try {
      if (formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      setFormData({
        id: "",
        supplierName: "",
        mobile: "",
        email: "",
        materialType: "",
        quantity: 0,
        pricePerUnit: 0,
        certification: "",
        factoryLocation: "",
        collectedLocationName: "",
        collectedLocation: { lat: 6.9271, lng: 79.8612 },
      });
      setEmailError("");
      setMobileError("");
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (m) => {
    setFormData({
      id: m._id,
      supplierName: m.supplierName,
      mobile: m.mobile,
      email: m.email,
      materialType: m.materialType,
      quantity: m.quantity,
      pricePerUnit: m.pricePerUnit,
      certification: m.certification,
      factoryLocation: m.factoryLocation,
      collectedLocationName: m.collectedLocationName,
      collectedLocation: m.collectedLocation || { lat: 6.9271, lng: 79.8612 },
    });
    setEmailError("");
    setMobileError("");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const generateAttractivePDF = (material) => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const imgProps = doc.getImageProperties(sasLogo);
    const imgWidth = 100;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(sasLogo, "JPEG", imgX, 20, imgWidth, imgHeight);

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#1f3a93");
    doc.text("Raw Material Report", pageWidth / 2, imgHeight + 50, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, imgHeight + 70, { align: "right" });

    const tableRows = [
      ["Supplier Name", material.supplierName || "-"],
      ["Mobile", material.mobile || "-"],
      ["Email", material.email || "-"],
      ["Material Type", material.materialType || "-"],
      ["Quantity", material.quantity || 0],
      ["Price per Unit", material.pricePerUnit || 0],
      ["Certification", material.certification || "-"],
      ["Factory Location", material.factoryLocation || "-"],
      ["Collected Location", material.collectedLocationName || "-"],
    ];

    autoTable(doc, {
      startY: imgHeight + 90,
      head: [["Field", "Value"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: "#2980b9", textColor: "#fff", halign: "center", fontStyle: "bold" },
      bodyStyles: { fontSize: 12, cellPadding: 6 },
      alternateRowStyles: { fillColor: "#f2f2f2" },
      columnStyles: { 0: { cellWidth: 150 }, 1: { cellWidth: 300 } },
    });

    const finalY = doc.lastAutoTable.finalY || imgHeight + 200;
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signature:", 40, finalY + 50);
    doc.line(150, finalY + 55, 350, finalY + 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor("#555");
    doc.text("Generated by Ferndale Tea Factory Management System", pageWidth / 2, 820, { align: "center" });

    doc.save(`RawMaterial_${material.supplierName || "unknown"}.pdf`);
  };

  return (
    <div className="raw-material-container">
      <h1>Raw Materials</h1>

      <form className="raw-material-form" onSubmit={handleSubmit}>
        <input
          name="supplierName"
          placeholder="Supplier Name"
          value={formData.supplierName}
          onChange={handleChange}
          required
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
          style={{ borderColor: mobileError ? "red" : undefined }}
        />
        {mobileError && <span style={{ color: "red", fontSize: "12px" }}>{mobileError}</span>}

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ borderColor: emailError ? "red" : undefined }}
        />
        {emailError && <span style={{ color: "red", fontSize: "12px" }}>{emailError}</span>}

        <input
          name="materialType"
          placeholder="Material Type"
          value={formData.materialType}
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />

        <input
          name="pricePerUnit"
          type="number"
          placeholder="Price Per Unit"
          value={formData.pricePerUnit}
          onChange={handleChange}
        />

        <input
          name="certification"
          placeholder="Certification"
          value={formData.certification}
          onChange={handleChange}
        />

        <select
          name="factoryLocation"
          value={formData.factoryLocation}
          onChange={handleChange}
          required
        >
          <option value="">Select Factory Location</option>
          <option value="Warehouse 1">Warehouse 1</option>
          <option value="Warehouse 2">Warehouse 2</option>
          <option value="Warehouse 3">Warehouse 3</option>
        </select>

        {/* Location Input with Autocomplete */}
        <div className="location-input-wrapper">
          <input
            name="collectedLocationName"
            placeholder="Collected Location Name (Start typing city name...)"
            value={loadingLocation ? "Loading location name..." : formData.collectedLocationName}
            onChange={handleLocationChange}
            onFocus={() => setShowSuggestions(citySuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            autoComplete="off"
            required
          />
          
          {/* City Suggestions Dropdown */}
          {showSuggestions && (
            <div className="city-suggestions-dropdown">
              {searchingCities ? (
                <div className="suggestion-item loading">Searching cities...</div>
              ) : (
                citySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleCitySelect(suggestion)}
                  >
                    <strong>{suggestion.city}</strong>
                    <br />
                    <small>{suggestion.name}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="map-container">
          <MapContainer
            center={[formData.collectedLocation.lat, formData.collectedLocation.lng]}
            zoom={10}
            style={{ height: "300px", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater 
              center={[formData.collectedLocation.lat, formData.collectedLocation.lng]} 
              zoom={13} 
            />
            <Marker
              draggable={true}
              position={[formData.collectedLocation.lat, formData.collectedLocation.lng]}
              eventHandlers={{ dragend: handleMarkerDrag }}
            />
          </MapContainer>
        </div>

        <p style={{ fontSize: "12px", marginTop: "5px" }}>
          Lat: {formData.collectedLocation.lat.toFixed(5)}, Lng: {formData.collectedLocation.lng.toFixed(5)}
        </p>

        <button type="submit" disabled={emailError !== "" || mobileError !== ""}>
          {formData.id ? "Update" : "Add"}
        </button>
      </form>

      <table className="raw-material-table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Material Type</th>
            <th>Qty</th>
            <th>Price/Unit</th>
            <th>Certification</th>
            <th>Factory Location</th>
            <th>Collected Location Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m._id}>
              <td>{m.supplierName}</td>
              <td>{m.mobile}</td>
              <td>{m.email}</td>
              <td>{m.materialType}</td>
              <td>{m.quantity}</td>
              <td>{m.pricePerUnit}</td>
              <td>{m.certification}</td>
              <td>{m.factoryLocation}</td>
              <td>{m.collectedLocationName}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button style={{ marginRight: "5px" }} onClick={() => handleEdit(m)}>Edit</button>
                <button style={{ marginRight: "5px" }} onClick={() => handleDelete(m._id)}>Delete</button>
                <button onClick={() => generateAttractivePDF(m)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddRawMaterial;
