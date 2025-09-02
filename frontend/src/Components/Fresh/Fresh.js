import React, { useState } from "react";
<<<<<<< Updated upstream
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
=======
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ setFormData, position, setPosition }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      // Reverse geocode
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        const address = data.display_name || `Lat: ${lat}, Lng: ${lng}`;
        setFormData((prev) => ({
          ...prev,
          farmLocation: address,
          latitude: lat,
          longitude: lng,
        }));
      } catch {
        setFormData((prev) => ({
          ...prev,
          farmLocation: `Lat: ${lat}, Lng: ${lng}`,
          latitude: lat,
          longitude: lng,
        }));
      }
    },
  });

  return position === null ? null : <Marker position={position} />;
>>>>>>> Stashed changes
}

function Fresh() {
  const [formData, setFormData] = useState({
    supplierName: "",
<<<<<<< Updated upstream
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
=======
    contactInfo: "",
    leafType: "",
    harvestDate: "",
    quantitySupplied: "",
    agreedPrice: "",
    paymentDetails: "",
    qualityCheckResults: "",
    farmLocation: "",
    latitude: "",
    longitude: "",
  });

  const [markerPosition, setMarkerPosition] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMarkerPosition({ lat: latitude, lng: longitude });

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.display_name || `Lat: ${latitude}, Lng: ${longitude}`;
          setFormData((prev) => ({
            ...prev,
            farmLocation: address,
            latitude,
            longitude,
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            farmLocation: `Lat: ${latitude}, Lng: ${longitude}`,
            latitude,
            longitude,
          }));
        }
      },
      (err) => {
        alert("Error fetching location: " + err.message);
      }
    );
>>>>>>> Stashed changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
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
=======
    console.log("Form Submitted:", formData);
    alert("Form submitted! Check console for details.");
  };

  return (
    <div>
      <h1>Fresh Tea Leaves Supplier Form</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Supplier Details</legend>

          {/* Supplier general details */}
          <div>
            <label>Supplier Name: </label>
            <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} required />
          </div>

          <div>
            <label>Contact Info: </label>
            <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
          </div>

          <div>
            <label>Leaf Type: </label>
            <input type="text" name="leafType" value={formData.leafType} onChange={handleChange} required />
          </div>

          <div>
            <label>Harvest Date: </label>
            <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} required />
          </div>

          <div>
            <label>Quantity Supplied (kg): </label>
            <input type="number" name="quantitySupplied" value={formData.quantitySupplied} onChange={handleChange} required />
          </div>

          <div>
            <label>Agreed Price (per kg): </label>
            <input type="number" name="agreedPrice" value={formData.agreedPrice} onChange={handleChange} required />
          </div>

          <div>
            <label>Payment Details: </label>
            <input type="text" name="paymentDetails" value={formData.paymentDetails} onChange={handleChange} required />
          </div>

          <div>
            <label>Quality Check Results: </label>
            <input type="text" name="qualityCheckResults" value={formData.qualityCheckResults} onChange={handleChange} required />
          </div>

          {/* ------------------ Farm Location at the END ------------------ */}
          <div>
            <label>Farm Location (click on map or use button): </label>
            <input type="text" name="farmLocation" value={formData.farmLocation} readOnly />
          </div>

          <div style={{ height: "300px", width: "100%", margin: "10px 0" }}>
            <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setFormData={setFormData} position={markerPosition} setPosition={setMarkerPosition} />
            </MapContainer>
          </div>

          <div style={{ margin: "10px 0" }}>
            <button type="button" onClick={getCurrentLocation}>
              Use My Current Location
            </button>
          </div>

          {/* Hidden lat/lng */}
          <input type="hidden" name="latitude" value={formData.latitude} />
          <input type="hidden" name="longitude" value={formData.longitude} />

          <button type="submit">Submit</button>
        </fieldset>
      </form>
>>>>>>> Stashed changes
    </div>
  );
}

export default Fresh;
