// Components/Delivery/Schedule.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import "./schedule.css";
import logo from "../../assets/logo.jpeg"; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const API_URL = "http://localhost:5000/api/schedules";
const VAN_URL = "http://localhost:5000/api/delivery-vans";

export default function Schedule() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const [items, setItems] = useState([]);
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [view, setView] = useState("table"); 
  const [vanFilter, setVanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [wholesalerFilter, setWholesalerFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const initialForm = {
    order_id: "",
    schedule_id: "",
    wholesaler_name: "",
    quantity: "",
    van_number: "",
    driver_name: "",
    pickup_location: "",
    dropoff_location: "",
    expected_date: "",
    start_time: "",
    end_time: "",
    status: "Pending",
    notes: ""
  };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // Fetch schedules & vans
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [resSchedules, resVans] = await Promise.all([
        axios.get(API_URL),
        axios.get(VAN_URL)
      ]);
      setItems(resSchedules.data);
      setVans(resVans.data);
    } catch (e) {
      setErr("Failed to load schedules or vans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        schedule_id: Number(form.schedule_id),
        quantity: Number(form.quantity),
        expected_date: new Date(form.expected_date).toISOString(),
        start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
        end_time: form.end_time ? new Date(form.end_time).toISOString() : null
      };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setForm(initialForm);
      setEditingId(null);
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (it) => {
    setEditingId(it._id);
    setForm({
      order_id: it.order_id,
      schedule_id: it.schedule_id,
      wholesaler_name: it.wholesaler_name,
      wholesaler_phone: it.wholesaler_phone || "",
      quantity: it.quantity,
      van_number: it.van_number,
      driver_name: it.driver_name,
      pickup_location: it.pickup_location,
      dropoff_location: it.dropoff_location,
      expected_date: it.expected_date ? it.expected_date.substring(0,10) : "",
      start_time: it.start_time ? it.start_time.substring(0,16) : "",
      end_time: it.end_time ? it.end_time.substring(0,16) : "",
      status: it.status,
      notes: it.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchAll();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${API_URL}/${id}/status`, { status });
    fetchAll();
  };

  const filtered = useMemo(() => {
    return items.filter(it => {
      const okVan = vanFilter ? it.van_number.toLowerCase().includes(vanFilter.toLowerCase()) : true;
      const okStatus = statusFilter ? it.status === statusFilter : true;
      const okWholesaler = wholesalerFilter ? it.wholesaler_name.toLowerCase().includes(wholesalerFilter.toLowerCase()) : true;
      const t = new Date(it.expected_date).getTime();
      const okFrom = dateFrom ? t >= new Date(dateFrom).getTime() : true;
      const okTo = dateTo ? t <= new Date(dateTo).getTime() : true;
      return okVan && okStatus && okWholesaler && okFrom && okTo;
    });
  }, [items, vanFilter, statusFilter, wholesalerFilter, dateFrom, dateTo]);

  const isOverdue = (it) => new Date(it.expected_date).getTime() < Date.now() && !['Completed','Canceled'].includes(it.status);

  const generatePDF = () => {
  const doc = new jsPDF();

  // Add logo
  const imgWidth = 25;
  const imgHeight = 25;
  doc.addImage(logo, "JPEG", 14, 10, imgWidth, imgHeight);

  // Factory name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Ferndale Tea Factory", 45, 20);

  // Report Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Delivery Report", 14, 45);

  // Date
  const today = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${today}`, 150, 45);

  // Table
  const head = [["OrderID","Van","Driver","Wholesaler","Phone","Qty","Pickup","Dropoff","Expected","Status"]];
  const body = filtered.map(it => [
    it.order_id,
    it.van_number,
    it.driver_name,
    it.wholesaler_name,
    it.wholesaler_phone || "N/A",
    it.quantity,
    it.pickup_location,
    it.dropoff_location,
    new Date(it.expected_date).toLocaleDateString(),
    it.status
  ]);

  autoTable(doc, {
    startY: 55,
    head,
    body,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
    bodyStyles: { fontSize: 10, halign: "center" },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  // Signature section
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.text("Authorized Signature: _______________________", 14, finalY);

  // Save PDF
  doc.save("delivery_report.pdf");
};

  const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(
    filtered.map(it => ({
      OrderID: it.order_id,
      Van: it.van_number,
      Driver: it.driver_name,
      Wholesaler: it.wholesaler_name,
      Phone: it.wholesaler_phone || "N/A",  
      Quantity: it.quantity,
      Pickup: it.pickup_location,
      Dropoff: it.dropoff_location,
      Expected: it.expected_date ? it.expected_date.substring(0,10) : "",
      Status: it.status
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "DeliveryReport");
  XLSX.writeFile(wb, "delivery_report.xlsx");
};

  

  // Calendar events
  const calendarEvents = filtered.map(it => ({
  id: it._id,
  // Include phone in the title
  title: `${it.van_number} • ${it.driver_name} • ${it.wholesaler_name} (${it.wholesaler_phone || "N/A"})`,
  start: it.start_time || it.expected_date,
  end: it.end_time || it.expected_date,
  color: it.status === 'Completed' ? '#2ecc71'
        : it.status === 'In Transit' ? '#f1c40f'
        : isOverdue(it) ? '#e74c3c' : undefined
}));


  // Live analytics
  const statusCounts = filtered.reduce((acc, it) => {
    acc[it.status] = (acc[it.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [{ data: Object.values(statusCounts), backgroundColor: ["#f1c40f","#2ecc71","#e74c3c","#3498db","#9b59b6","#e67e22"] }]
  };

  const vansUsage = {};
  filtered.forEach(it => { vansUsage[it.van_number] = (vansUsage[it.van_number]||0)+1; });
  const barData = {
    labels: Object.keys(vansUsage),
    datasets: [{ label: "Deliveries per Van", data: Object.values(vansUsage), backgroundColor:"#3498db" }]
  };

  if (loading) return <p>Loading schedules...</p>;
  if (err) return <p>{err}</p>;

  return (
    <div className="schedule-container">
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={()=>{localStorage.clear(); navigate("/login");}}>Logout</button>
      </div>

      <div style={{ padding: "20px" }}>
  <button className="back-button" onClick={()=>navigate("/deliveryDashboard")}>
    ← Back to Dashboard
  </button>
</div>

      <h2>Delivery Schedule Management</h2>

{/* Filters */}
<div className="toolbar">
  <input placeholder="Van" value={vanFilter} onChange={e=>setVanFilter(e.target.value)} />
  <input placeholder="Wholesaler" value={wholesalerFilter} onChange={e=>setWholesalerFilter(e.target.value)} />
  <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
    <option value="">All Status</option>
    {['Pending','Scheduled','Dispatched','In Transit','Completed','Canceled'].map(s=>(
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
  <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
  <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
  <button onClick={()=>{setVanFilter(""); setWholesalerFilter(""); setStatusFilter(""); setDateFrom(""); setDateTo("");}}>Clear</button>
</div>

      <div className="actions">
  <button title="Switch to Calendar View" onClick={()=>setView(view==="table"?"calendar":"table")}>
    {view==="table" ? "Calendar View" : "Table View"}
  </button>
  <button title="Download delivery schedule as PDF" onClick={generatePDF}>Export PDF 📄</button>
  <button title="Download delivery schedule as Excel" onClick={exportExcel}>Export Excel 📊</button>
  
  <button title="send delivery report to delivery person"
  onClick={() => {
    const email = prompt("Enter the email of the delivery van you want to send the report to:");

    if (!email) {
      alert("No email provided");
      return;
    }

    const cleanEmail = email.trim();

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      alert("Invalid email address. Please enter a valid email.");
      return;
    }

    const subject = encodeURIComponent("Delivery Report");
    const body = encodeURIComponent(
      "Please find the attached delivery report.\n\n(Attach PDF manually)"
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${subject}&body=${body}`;

    const win = window.open(gmailUrl, "_blank");

    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = mailtoUrl;
    }
  }}
>
  Send Email ✉️
</button>





  
</div>


      {view==="calendar" ? (
        <FullCalendar
          plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' }}
          events={calendarEvents}
          height="auto"
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Schedule ID</th><th>OrderID</th><th>Van</th><th>Driver</th><th>Wholesaler</th><th>Wholesaler Phone</th><th>Qty</th>
                <th>Pickup</th><th>Dropoff</th><th>Expected</th><th>Status</th><th>Timeline</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(it=>(
                <tr key={it._id} className={isOverdue(it)?"overdue":""}>
                  <td>{it.schedule_id}</td>
                  <td>{it.order_id}</td>
                  <td>{it.van_number}</td>
                  <td>{it.driver_name}</td>
                  <td>{it.wholesaler_name}</td>
                  <td>{it.wholesaler_phone || "N/A"}</td> 
                  <td>{it.quantity}</td>
                  <td>{it.pickup_location}</td>
                  <td>{it.dropoff_location}</td>
                  <td>{new Date(it.expected_date).toLocaleDateString()}</td>
                  <td>{it.status}</td>
                  <td>
                    {it.history.map(h=>(<div key={h.timestamp}>{h.status} @ {new Date(h.timestamp).toLocaleString()}</div>))}
                  </td>
                  <td>
                    <button onClick={()=>updateStatus(it._id,'Dispatched')}>Dispatch</button>
                    <button onClick={()=>updateStatus(it._id,'In Transit')}>In Transit</button>
                    <button onClick={()=>updateStatus(it._id,'Completed')}>Done</button>
                    <button onClick={()=>onEdit(it)}>Edit</button>
                    <button onClick={()=>onDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan="11">No schedules found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

     {/* Form */}
<div className="form-container">
  <h3>{editingId ? "Edit Delivery" : "New Delivery"}</h3>
  <form onSubmit={onSubmit}>
    
    {/* Row 1 */}
    <div className="form-row">
      <input name="schedule_id" value={form.schedule_id} placeholder="Schedule Id" readOnly />
      <input name="order_id" value={form.order_id} placeholder="Order ID" onChange={onChange} required />
    </div>

    {/* Row 2 */}
    <div className="form-row">
      <input name="wholesaler_name" value={form.wholesaler_name} placeholder="Wholesaler" onChange={onChange} required />
      <input name="wholesaler_phone" value={form.wholesaler_phone} placeholder="Phone" onChange={onChange} required pattern="^07[0-9]{8}$"
          title="Enter a valid 10-digit Sri Lankan phone number starting with 07"
 />
    </div>

    {/* Row 3 */}
    <div className="form-row">
      <input name="quantity" type="number" value={form.quantity} placeholder="Quantity" onChange={onChange} required />
      <select name="van_number" value={form.van_number} onChange={onChange} required>
        <option value="">Select Van</option>
        {vans.filter(v=>v.availability_status==="Available").map(v=>(
          <option key={v._id} value={v.van_number}>{v.van_number} ({v.name})</option>
        ))}
      </select>
    </div>

    {/* Row 4 */}
    <div className="form-row">
      <input name="driver_name" value={form.driver_name} placeholder="Driver" onChange={onChange} required />
      <input name="pickup_location" value={form.pickup_location} placeholder="Pickup Location" onChange={onChange} required />
    </div>

    {/* Row 5 */}
    <div className="form-row">
      <input name="dropoff_location" value={form.dropoff_location} placeholder="Dropoff Location" onChange={onChange} required />
      <input name="expected_date" type="date" value={form.expected_date} onChange={onChange} required />
    </div>

    {/* Row 6 */}
    <div className="form-row">
      <input name="start_time" type="datetime-local" value={form.start_time} onChange={onChange} />
      <input name="end_time" type="datetime-local" value={form.end_time} onChange={onChange} />
    </div>

    {/* Row 7 */}
    <div className="form-row">
      <select name="status" value={form.status} onChange={onChange}>
        {['Pending','Scheduled','Dispatched','In Transit','Completed','Canceled'].map(s=>(
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={onChange}></textarea>
    </div>

    <div className="form-buttons">
      <button type="submit" className="btn-primary">{editingId ? "Update" : "Create"}</button>
      {editingId && <button type="button" className="btn-secondary" onClick={()=>{setEditingId(null); setForm(initialForm)}}>Cancel</button>}
    </div>

  </form>
</div>




    {/* Live Charts */}
<div className="charts">
  {/* Status Distribution */}
  <div className="chart-box status">
    <h3>Status Distribution</h3>
    <Pie data={pieData} />
  </div>

  {/* Van Usage */}
  <div className="chart-box usage">
    <h3>Van Usage</h3>
    <Bar data={barData} />
  </div>
</div>


   

      {/* Scroll to top */}
      <button className="scroll-top" onClick={()=>window.scrollTo({top:0, behavior:"smooth"})}>↑ Top</button>
    </div>
  );
}
