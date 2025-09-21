import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./Raw.css";
import printLogo from "../../assets/printlogo.png";

// Configure default Leaflet marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Recenter map when marker moves
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (!center || !map) return;
    map.setView(center);
  }, [center, map]);
  return null;
}

// Draggable marker with reverse geocoding
function DraggableMarker({ position, setFormData }) {
  const [markerPosition, setMarkerPosition] = useState(position);

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  const handleDragEnd = async (e) => {
    const latlng = e.target.getLatLng();
    const lat = latlng.lat;
    const lng = latlng.lng;
    setMarkerPosition([lat, lng]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      const placeName =
        (data && data.display_name) || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationName: placeName,
      }));
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationName: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      }));
    }
  };

  return (
    <Marker
      position={markerPosition}
      draggable={true}
      eventHandlers={{ dragend: handleDragEnd }}
    />
  );
}

function Raw() {
  const initial = {
    supplierName: "",
    contactPerson: "",
    phone: "",
    email: "",
    company: "",
    materialType: "",
    quantity: "",
    pricePerUnit: "",
    leadTime: "",
    certification: "",
    latitude: 7.8731,
    longitude: 80.7718,
    locationName: "",
  };

  const [formData, setFormData] = useState(initial);
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocation = () => {
    if (!navigator || !navigator.geolocation) return alert("Geolocation not available.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationName: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        }));
      },
      (err) => console.error("Geolocation error:", err)
    );
  };

  // ✅ Fetch existing raw material suppliers from backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/raw-suppliers");
        setSubmittedData(res.data.suppliers); // assuming backend returns { suppliers: [...] }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editIndex !== null) {
        const updated = await axios.put(
          `http://localhost:5000/api/raw-suppliers/${submittedData[editIndex]._id}`,
          formData
        );
        const newData = [...submittedData];
        newData[editIndex] = updated.data.supplier;
        setSubmittedData(newData);
        setEditIndex(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/raw-suppliers", formData);
        setSubmittedData([...submittedData, res.data.supplier]);
      }

      setFormData(initial);
    } catch (err) {
      console.error("Error saving supplier:", err);
      alert("Failed to save supplier. Check console for details.");
    }
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updated);
  };

  const handlePrint = (row) => {
    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) return;

    const now = new Date().toLocaleString();

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Supplier Slip</title>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <style>
            body { font-family: "Times New Roman", serif; padding: 20px; background: #fff; color: #000; }
            .slip { border: 2px solid #2c3e50; border-radius: 10px; padding: 25px; max-width: 500px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin-bottom: 20px; }
            .header img { max-width: 100px; height: auto; margin-bottom: 5px; }
            .header h1 { margin: 0; font-size: 22px; color: #2c3e50; }
            .header h2 { margin: 5px 0 0 0; font-size: 16px; color: #555; }
            .data p { margin: 4px 0; font-size: 14px; }
            .sign { margin-top: 40px; text-align: right; font-size: 14px; }
            .footer { border-top: 2px solid #2c3e50; margin-top: 20px; padding-top: 10px; font-size: 12px; text-align: center; color: #555; }
          </style>
        </head>
        <body>
          <div class="slip">
            <div class="header">
              <img src="${printLogo}" alt="Factory Logo"/>
              <h1>Green Leaf Tea Factory</h1>
              <h2>Raw Material Supplier Slip</h2>
            </div>
            <div class="data">
              ${Object.entries(row)
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value == null ? "" : value}</p>`)
                .join("")}
            </div>
            <div class="sign">
              ________________________ <br/>
              Authorized Signature
            </div>
            <div class="footer">
              Generated on: ${now} <br/>
              Thank you for supplying quality raw materials.
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleGmail = (row) => {
    const subject = encodeURIComponent("Raw Material Supplier Information");
    const body = encodeURIComponent(
      Object.entries(row)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    );
    const mailTo = row.email || "";
    window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="raw-container">
      <h1>Raw Material Supplier Form</h1>

      <form className="raw-form" onSubmit={handleSubmit}>
        <label>Supplier Name:
          <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} required />
        </label>
        <label>Contact Person:
          <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
        </label>
        <label>Phone:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>Company/Organization:
          <input type="text" name="company" value={formData.company} onChange={handleChange} />
        </label>
        <label>Material Type:
          <input type="text" name="materialType" value={formData.materialType} onChange={handleChange} required />
        </label>
        <label>Quantity Available:
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </label>
        <label>Price per Unit:
          <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} />
        </label>
        <label>Delivery Lead Time:
          <input type="text" name="leadTime" value={formData.leadTime} onChange={handleChange} />
        </label>
        <label>Certification/Quality Standard:
          <input type="text" name="certification" value={formData.certification} onChange={handleChange} />
        </label>
        <label>Location Name:
          <input type="text" name="locationName" value={formData.locationName} onChange={handleChange} placeholder="Enter or drag marker on map"/>
        </label>

        <div className="button-row">
          <button type="button" onClick={handleLocation}>Get Live Location</button>
          <button type="submit" className="submit-btn">{editIndex !== null ? "Update" : "Submit"}</button>
        </div>
      </form>

      <div className="map-container">
        <MapContainer center={[formData.latitude, formData.longitude]} zoom={7} style={{ height: "320px", width: "100%" }}>
          <RecenterMap center={[formData.latitude, formData.longitude]} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <DraggableMarker position={[formData.latitude, formData.longitude]} setFormData={setFormData} />
        </MapContainer>
      </div>

      {submittedData.length > 0 && (
        <div className="submitted-data">
          <h2>Submitted Suppliers</h2>
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Material</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Lead Time</th>
                <th>Certification</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.supplierName}</td>
                  <td>{row.contactPerson}</td>
                  <td>{row.email}</td>
                  <td>{row.materialType}</td>
                  <td>{row.quantity}</td>
                  <td>{row.pricePerUnit}</td>
                  <td>{row.leadTime}</td>
                  <td>{row.certification}</td>
                  <td>{row.locationName}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                    <button onClick={() => handlePrint(row)}>Print</button>
                    <button onClick={() => handleGmail(row)}>Gmail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Raw;
