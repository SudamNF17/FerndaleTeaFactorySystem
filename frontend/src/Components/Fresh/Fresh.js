import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Fresh.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
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
          locationName: `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(
            4
          )}`,
        }));
      }
    },
  };

  return <Marker position={markerPosition} draggable={true} eventHandlers={eventHandlers} />;
}

function Fresh() {
  const [formData, setFormData] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
    email: "",
    farmLocation: "",
    teaType: "",
    organicCertified: false,
    harvestSeason: "",
    pricePerKg: "",
    latitude: 7.8731,
    longitude: 80.7718,
    locationName: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setFormData({
          ...formData,
          latitude: coords[0],
          longitude: coords[1],
          locationName: `Lat: ${coords[0].toFixed(4)}, Lng: ${coords[1].toFixed(4)}`,
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
      farmLocation: "",
      teaType: "",
      organicCertified: false,
      harvestSeason: "",
      pricePerKg: "",
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
    printWindow.document.write("<h2>Fresh Tea Supplier Data</h2>");
    Object.entries(row).forEach(([key, value]) => {
      printWindow.document.write(`<p><b>${key}:</b> ${value}</p>`);
    });
    printWindow.print();
  };

  const handleSendGmail = (row) => {
    const subject = encodeURIComponent("Fresh Tea Supplier Information");
    const body = encodeURIComponent(
      Object.entries(row)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    );
    window.location.href = `mailto:${row.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fresh-container">
      <h1>Fresh Tea Supplier Form</h1>
      <form className="fresh-form" onSubmit={handleSubmit}>
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
          Phone Number:
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
          Farm Location:
          <input
            type="text"
            name="farmLocation"
            value={formData.farmLocation}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Type of Tea:
          <input
            type="text"
            name="teaType"
            value={formData.teaType}
            onChange={handleChange}
            required
          />
        </label>

        <label className="checkbox-label">
          Organic Certified
          <input
            type="checkbox"
            name="organicCertified"
            checked={formData.organicCertified}
            onChange={handleChange}
          />
        </label>

        <label>
          Harvest Season:
          <input
            type="text"
            name="harvestSeason"
            value={formData.harvestSeason}
            onChange={handleChange}
          />
        </label>

        <label>
          Price per Kg:
          <input
            type="number"
            name="pricePerKg"
            value={formData.pricePerKg}
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
            placeholder="Drag marker on map or get location"
          />
        </label>

        <button type="button" onClick={handleGetLocation}>
          Get Live Location
        </button>

        <button type="submit">{editIndex !== null ? "Update" : "Submit"}</button>
      </form>

      <div className="map-container">
        <MapContainer
          center={[formData.latitude, formData.longitude]}
          zoom={7}
          style={{ height: "250px", width: "100%" }}
        >
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
                <th>Farm Location</th>
                <th>Tea Type</th>
                <th>Organic</th>
                <th>Harvest Season</th>
                <th>Price</th>
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
                  <td>{row.farmLocation}</td>
                  <td>{row.teaType}</td>
                  <td>{row.organicCertified ? "Yes" : "No"}</td>
                  <td>{row.harvestSeason}</td>
                  <td>{row.pricePerKg}</td>
                  <td>{row.locationName}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                    <button onClick={() => handlePrint(row)}>Print</button>
                    <button onClick={() => handleSendGmail(row)}>Gmail</button>
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

export default Fresh;
