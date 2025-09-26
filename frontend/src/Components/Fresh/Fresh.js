import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios"; // ✅ Axios
import "./Fresh.css";
import printLogo from "../../assets/printlogo.png";

// Fix default marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Recenter map when lat/lng updates
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center);
  }, [center, map]);
  return null;
}

// Draggable marker with reverse geocoding
function DraggableMarker({ position, setFormData }) {
  const [markerPosition, setMarkerPosition] = useState(position);

  useEffect(() => setMarkerPosition(position), [position]);

  const handleDragEnd = async (e) => {
    const latlng = e.target.getLatLng();
    const lat = latlng.lat;
    const lng = latlng.lng;
    setMarkerPosition([lat, lng]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const placeName =
        data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

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

function Fresh() {
  const initial = {
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
  };

  const [formData, setFormData] = useState(initial);
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocation = () => {
    if (!navigator.geolocation)
      return alert("Geolocation not supported by this browser");
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


//validation function 1123444

  function IntegerInput({ value, onChange }) {
  const handleKeyDown = (event) => {
    if (!/[0-9]/.test(event.key)) event.preventDefault();
  };
  return (
    <label>
      Number:
      <input type="number" value={value} onChange={onChange} onKeyDown={handleKeyDown} />
    </label>
  );
}

// In Fresh render
<IntegerInput value={formData.someNumber} onChange={handleChange} />


  // ✅ Fetch existing suppliers from MongoDB on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fresh-suppliers");
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
        // Update existing supplier
        const updated = await axios.put(
          `http://localhost:5000/api/fresh-suppliers/${submittedData[editIndex]._id}`,
          formData
        );
        const newData = [...submittedData];
        newData[editIndex] = updated.data.supplier;
        setSubmittedData(newData);
        setEditIndex(null);
      } else {
        // Add new supplier
        const res = await axios.post("http://localhost:5000/api/fresh-suppliers", formData);
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
    setSubmittedData(submittedData.filter((_, i) => i !== index));
  };

  const handlePrint = (row) => {
    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) return;

    const now = new Date().toLocaleString();

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Fresh Supplier Slip</title>
          <style>
            body { font-family: "Times New Roman", serif; padding: 20px; color: #000; }
            .slip { border: 2px solid #2c3e50; border-radius: 10px; padding: 25px; max-width: 500px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin-bottom: 20px; }
            .header img { max-width: 100px; margin-bottom: 5px; }
            .header h1 { margin: 0; font-size: 22px; color: #2c3e50; }
            .header h2 { margin: 5px 0 0; font-size: 16px; color: #555; }
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
              <h2>Fresh Tea Supplier Slip</h2>
            </div>
            <div class="data">
              ${Object.entries(row)
                .map(
                  ([key, value]) =>
                    `<p><strong>${key}:</strong> ${
                      value === true ? "Yes" : value === false ? "No" : value
                    }</p>`
                )
                .join("")}
            </div>
            <div class="sign">
              ________________________ <br/>
              Authorized Signature
            </div>
            <div class="footer">
              Generated on: ${now}<br/>
              Thank you for supplying fresh tea leaves.
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
  <label>Supplier Name:
    <input
      type="text"
      name="supplierName"
      value={formData.supplierName}
      onChange={handleChange}
      required
      minLength={3}
      placeholder="Enter supplier name"
    />
  </label>

  <label>Contact Person:
    <input
      type="text"
      name="contactPerson"
      value={formData.contactPerson}
      onChange={handleChange}
      required
      minLength={3}
      placeholder="Full name"
    />
  </label>

  <label>Phone:
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      required
      pattern="^\+?[0-9]{7,15}$"
      placeholder="e.g. +94771234567"
    />
    </label>
  

  <label>Email:
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      placeholder="example@email.com"
    />
  </label>

  <label>Farm Location:
    <input
      type="text"
      name="farmLocation"
      value={formData.farmLocation}
      onChange={handleChange}
      required
      minLength={3}
      placeholder="Village / Town"
    />
  </label>

  <label>Tea Type:
    <input
      type="text"
      name="teaType"
      value={formData.teaType}
      onChange={handleChange}
      required
      placeholder="Green / Black / White"
    />
  </label>

  <label className="checkbox-label">Organic Certified
    <input
      type="checkbox"
      name="organicCertified"
      checked={formData.organicCertified}
      onChange={handleChange}
    />
  </label>

  <label>Harvest Season:
    <input
      type="text"
      name="harvestSeason"
      value={formData.harvestSeason}
      onChange={handleChange}
      placeholder="e.g. April - June"
    />
  </label>

  <label>Price per Kg:
    <input
      type="number"
      name="pricePerKg"
      value={formData.pricePerKg}
      onChange={handleChange}
      min="1"
      step="0.01"
      placeholder="Enter price"
    />
  </label>

  <label>Location Name:
    <input
      type="text"
      name="locationName"
      value={formData.locationName}
      onChange={handleChange}
      required
      placeholder="Enter or drag marker on map"
    />
  </label>

 <label>
  Number:
  <input
    type="number"
    name="someNumber"
    value={formData.someNumber || ""}
    onChange={(e) => {
      const val = e.target.value;
      if (/^\d*$/.test(val)) {
        setFormData(prev => ({ ...prev, someNumber: val }));
      }
    }}
    placeholder="Enter an integer"
  />
</label>



  <div className="button-row">
    <button type="button" onClick={handleLocation}>Get Live Location</button>
    <button type="submit" className="submit-btn">
      {editIndex !== null ? "Update" : "Submit"}
    </button>
  </div>
  
</form>


      <div className="map-container">
        <MapContainer center={[formData.latitude, formData.longitude]} zoom={7} style={{ height: "300px", width: "100%" }}>
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
                <th>Tea Type</th>
                <th>Organic</th>
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
                  <td>{row.teaType}</td>
                  <td>{row.organicCertified ? "Yes" : "No"}</td>
                  <td>{row.pricePerKg}</td>
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

export default Fresh;
