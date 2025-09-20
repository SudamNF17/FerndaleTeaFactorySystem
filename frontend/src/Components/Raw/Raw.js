import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Raw.css";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Draggable marker with reverse geocoding
function DraggableMarker({ position, setFormData }) {
  const [markerPosition, setMarkerPosition] = useState(position);

  const eventHandlers = {
    dragend: async (e) => {
      const latlng = e.target.getLatLng();
      setMarkerPosition([latlng.lat, latlng.lng]);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
        );
        const data = await response.json();
        const placeName =
          data.display_name ||
          `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`;

        setFormData((prev) => ({
          ...prev,
          latitude: latlng.lat,
          longitude: latlng.lng,
          locationName: placeName,
        }));
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setFormData((prev) => ({
          ...prev,
          latitude: latlng.lat,
          longitude: latlng.lng,
          locationName: `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`,
        }));
      }
    },
  };

  return <Marker position={markerPosition} draggable={true} eventHandlers={eventHandlers} />;
}

function Raw() {
  const [formData, setFormData] = useState({
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
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          locationName: `Lat: ${pos.coords.latitude.toFixed(
            4
          )}, Lng: ${pos.coords.longitude.toFixed(4)}`,
        });
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedData = [...submittedData];
      updatedData[editIndex] = formData;
      setSubmittedData(updatedData);
      setEditIndex(null);
    } else {
      setSubmittedData([...submittedData, formData]);
    }

    setFormData({
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
    });
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
  };

  const handlePrint = (row) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<h2>Raw Material Supplier Data</h2>");
    Object.entries(row).forEach(([key, value]) => {
      printWindow.document.write(`<p><b>${key}:</b> ${value}</p>`);
    });
    printWindow.print();
  };

  const handleGmail = (row) => {
    const subject = encodeURIComponent("Raw Material Supplier Information");
    const body = encodeURIComponent(
      `Here are the details:\n\n${Object.entries(row)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}`
    );
    window.location.href = `mailto:${row.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="raw-container">
      <h1>Raw Material Supplier Form</h1>
      <form className="raw-form" onSubmit={handleSubmit}>
        <label>
          Supplier Name:
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contact Person:
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Company/Organization:
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </label>

        <label>
          Material Type:
          <input
            type="text"
            name="materialType"
            value={formData.materialType}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Quantity Available:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </label>

        <label>
          Price per Unit:
          <input
            type="number"
            name="pricePerUnit"
            value={formData.pricePerUnit}
            onChange={handleChange}
          />
        </label>

        <label>
          Delivery Lead Time:
          <input
            type="text"
            name="leadTime"
            value={formData.leadTime}
            onChange={handleChange}
          />
        </label>

        <label>
          Certification/Quality Standard:
          <input
            type="text"
            name="certification"
            value={formData.certification}
            onChange={handleChange}
          />
        </label>

        <label>
          Location Name:
          <input
            type="text"
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            placeholder="Enter or drag marker on map"
          />
        </label>

        <button type="button" onClick={handleLocation}>
          Get Live Location
        </button>

        <div className="map-container">
          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={7}
            style={{ height: "250px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <DraggableMarker
              position={[formData.latitude, formData.longitude]}
              setFormData={setFormData}
            />
          </MapContainer>
        </div>

        <button type="submit" className="submit-btn">
          {editIndex !== null ? "Update" : "Submit"}
        </button>
      </form>

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
