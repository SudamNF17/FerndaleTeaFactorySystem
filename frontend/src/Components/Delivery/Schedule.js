import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./schedule.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/schedules";

export default function Schedule() {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // filters
  const [vanFilter, setVanFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // form
  const initial = {
    schedule_id: "",
    van_number: "",
    driver_name: "",
    pickup_location: "",
    dropoff_location: "",
    start_time: "",
    end_time: "",
    status: "Scheduled",
    notes: "",
  };
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (e) {
      setErr("Failed to load schedules");
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
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setForm(initial);
      setEditingId(null);
      fetchAll();
    } catch (e) {
      if (e.response?.status === 409) alert(e.response.data.message);
      else alert(e.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (it) => {
    setEditingId(it._id);
    setForm({
      schedule_id: it.schedule_id,
      van_number: it.van_number,
      driver_name: it.driver_name,
      pickup_location: it.pickup_location,
      dropoff_location: it.dropoff_location,
      start_time: it.start_time ? it.start_time.substring(0,16) : "",
      end_time: it.end_time ? it.end_time.substring(0,16) : "",
      status: it.status,
      notes: it.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAll();
    } catch {
      alert("Delete failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status });
      fetchAll();
    } catch {
      alert("Status update failed");
    }
  };

  // filtering client-side
  const filtered = useMemo(() => {
    return items.filter(it => {
      const okVan = vanFilter ? it.van_number.toLowerCase().includes(vanFilter.toLowerCase()) : true;
      const t = new Date(it.start_time).getTime();
      const okFrom = dateFrom ? t >= new Date(dateFrom).getTime() : true;
      const okTo = dateTo ? t <= new Date(dateTo).getTime() : true;
      return okVan && okFrom && okTo;
    });
  }, [items, vanFilter, dateFrom, dateTo]);

  // overdue detection
  const now = Date.now();
  const isOverdue = (it) => new Date(it.end_time).getTime() < now && !['Completed','Canceled'].includes(it.status);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Delivery Schedules Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const head = [[
      "Schedule ID","Van","Driver","Pickup","Drop-off","Start","End","Status"
    ]];

    const body = filtered.map(it => [
      it.schedule_id,
      it.van_number,
      it.driver_name,
      it.pickup_location,
      it.dropoff_location,
      new Date(it.start_time).toLocaleString(),
      new Date(it.end_time).toLocaleString(),
      it.status,
    ]);

    autoTable(doc, { startY: 30, head, body });
    doc.save("delivery_schedules_report.pdf");
  };

  const calendarEvents = filtered.map(it => ({
    id: it._id,
    title: `${it.van_number} • ${it.driver_name}`,
    start: it.start_time,
    end: it.end_time,
    color: it.status === 'Completed' ? '#2ecc71'
         : it.status === 'In Progress' ? '#f1c40f'
         : isOverdue(it) ? '#e74c3c'
         : undefined
  }));

  const [view, setView] = useState("table"); // 'table' | 'calendar'

  if (loading) return <p>Loading schedules...</p>;
  if (err) return <p>{err}</p>;

  return (
    <div className="schedule-container">
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ padding: "20px" }}>
      <button
        className="back-button"
        onClick={() => navigate("/deliveryDashboard")}
      >
        ← Back to Dashboard
      </button>
      </div>




      <h2>Delivery Schedule Management</h2>

      {/* Filters + actions */}
      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by van number"
            value={vanFilter}
            onChange={(e) => setVanFilter(e.target.value)}
          />
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
          <button onClick={() => { setVanFilter(""); setDateFrom(""); setDateTo(""); }}>Clear</button>
        </div>
        <div className="actions">
          <button onClick={() => setView(view === "table" ? "calendar" : "table")}>
            {view === "table" ? "Calendar View" : "Table View"}
          </button>
          <button onClick={generatePDF}>Generate PDF</button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="calendar-wrap">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            height="auto"
          />
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sch. ID</th>
                <th>Van</th>
                <th>Driver</th>
                <th>Pickup</th>
                <th>Drop-off</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Quick</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(it => (
                <tr key={it._id} className={isOverdue(it) ? "overdue" : ""}>
                  <td>{it.schedule_id}</td>
                  <td>{it.van_number}</td>
                  <td>{it.driver_name}</td>
                  <td>{it.pickup_location}</td>
                  <td>{it.dropoff_location}</td>
                  <td>{new Date(it.start_time).toLocaleString()}</td>
                  <td>{new Date(it.end_time).toLocaleString()}</td>
                  <td><span className={`status ${it.status.replace(" ","-").toLowerCase()}`}>{it.status}</span></td>
                  <td className="quick">
                    <button className="status-btn in-progress" onClick={()=>updateStatus(it._id,'In Progress')}>In Progress</button>
                    <button className="status-btn completed" onClick={()=>updateStatus(it._id,'Completed')}>Done</button>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={()=>onEdit(it)}>Edit</button>
                    <button className="action-btn danger"
                     onClick={()=>onDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="10" style={{textAlign:'center'}}>No schedules</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <h3>{editingId ? "Edit Schedule" : "Add New Schedule"}</h3>
      <form onSubmit={onSubmit} className="schedule-form">
        <div>
          <label>Schedule ID</label>
          <input type="number" name="schedule_id" value={form.schedule_id} onChange={onChange} required />
        </div>
        <div>
          <label>Van Number</label>
          <input type="text" name="van_number" value={form.van_number} onChange={onChange} required />
        </div>
        <div>
          <label>Driver Name</label>
          <input type="text" name="driver_name" value={form.driver_name} onChange={onChange} required />
        </div>
        <div>
          <label>Pickup Location</label>
          <input type="text" name="pickup_location" value={form.pickup_location} onChange={onChange} required />
        </div>
        <div>
          <label>Drop-off Location</label>
          <input type="text" name="dropoff_location" value={form.dropoff_location} onChange={onChange} required />
        </div>
        <div>
          <label>Start Time</label>
          <input type="datetime-local" name="start_time" value={form.start_time} onChange={onChange} required />
        </div>
        <div>
          <label>End Time</label>
          <input type="datetime-local" name="end_time" value={form.end_time} onChange={onChange} required />
        </div>
        <div>
          <label>Status</label>
          <select name="status" value={form.status} onChange={onChange}>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Canceled</option>
          </select>
        </div>
        <div>
          <label>Notes</label>
          <textarea name="notes" rows={3} value={form.notes} onChange={onChange} />
        </div>

        <div className="form-actions">
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button type="button" className="secondary"
              onClick={()=>{ setForm(initial); setEditingId(null); }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
             ↑
        </button>
    </div>
  );
}
