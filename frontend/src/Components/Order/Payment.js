import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import OSM from 'ol/source/OSM.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { fromLonLat, toLonLat } from 'ol/proj.js';
import { Icon, Style } from 'ol/style.js';

// ✅ Import shared Header and Footer
import Header from "./Header";
import Footer from "./Footer";

export default function Payment() {
  const navigate = useNavigate();

  // ---- Read persisted data ----
  const cart = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  }, []);

  const totalsFromLS = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('totals') || '{}'); } catch { return {}; }
  }, []);

  const totals = useMemo(() => {
    if (totalsFromLS && typeof totalsFromLS.total === 'number') return totalsFromLS;
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [cart, totalsFromLS]);

  // ---- User + location ----
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || { name: '', email: '', address: '', phone: '' }; }
    catch { return { name: '', email: '', address: '', phone: '' }; }
  });
  const [markerCoord, setMarkerCoord] = useState(() => {
    try { return JSON.parse(localStorage.getItem('location') || 'null'); } catch { return null; }
  });

  // ---- Map setup ----
  const mapEl = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }));

  useEffect(() => {
    if (!mapEl.current) return;

    const defaultCenter = fromLonLat([79.8612, 6.9271]); // Colombo
    const map = new Map({
      target: mapEl.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayerRef.current],
      view: new View({ center: defaultCenter, zoom: 12 }),
      controls: [],
    });

    // If we already have a saved pin, restore it
    if (markerCoord && Array.isArray(markerCoord) && markerCoord.length === 2) {
      const coord3857 = fromLonLat(markerCoord);
      const feature = new Feature({ geometry: new Point(coord3857) });
      feature.setStyle(new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          anchor: [0.5, 1],
          scale: 0.08
        })
      }));
      vectorSourceRef.current.addFeature(feature);
      map.getView().setCenter(coord3857);
      map.getView().setZoom(14);
    }

    // Click to drop/move pin
    map.on('click', async (evt) => {
      const coord = evt.coordinate; // EPSG:3857
      vectorSourceRef.current.clear();

      const feature = new Feature({ geometry: new Point(coord) });
      feature.setStyle(new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          anchor: [0.5, 1],
          scale: 0.08
        })
      }));
      vectorSourceRef.current.addFeature(feature);

      const [lon, lat] = toLonLat(coord);
      setMarkerCoord([lon, lat]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();
        if (data && data.display_name) {
          setUser(prev => ({ ...prev, address: data.display_name }));
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }
    });

    return () => map.setTarget(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Validation + Actions ----
  const handlePay = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items first.');
      return;
    }

    if (!user.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(user.email)) {
      alert("Please enter a valid email (must contain '@' and end with '.com').");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(user.phone || "")) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!user.address.trim()) {
      alert("Please provide your delivery address.");
      return;
    }

    const orderData = {
      buyer: { ...user },
      cart: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      totals: totals,
      deliveryLocation: markerCoord
        ? { lat: markerCoord[1], lng: markerCoord[0] }
        : null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/bill/${data.order._id}`);
      } else {
        alert("❌ Failed to place order: " + data.message);
      }
    } catch (err) {
      alert("❌ Error placing order: " + err.message);
    }
  };

  const handleUpdateCart = () => {
    localStorage.setItem('user', JSON.stringify(user));
    if (markerCoord) localStorage.setItem('location', JSON.stringify(markerCoord));
    navigate(-1);
  };

  // ---- UI ----
  return (
    <div className="cart-app">
      {/* ✅ Shared Header */}
      <Header />

      <div className="content-container" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        {/* Left: Cart details + Map */}
        <section className="products-section">
          <h2>Order Summary</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty. <button className="clear-cart-btn" onClick={() => navigate('/')}>Back to Shop</button></p>
          ) : (
            <>
              <div className="cart-items" style={{ maxHeight: 250 }}>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p>${item.price} × {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row"><span>Subtotal:</span><span>${(totals.subtotal ?? 0).toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping:</span><span>${(totals.shipping ?? 0).toFixed(2)}</span></div>
                <div className="summary-row total"><span>Total:</span><span>${(totals.total ?? 0).toFixed(2)}</span></div>
              </div>

              <h2 style={{ marginTop: '1rem' }}>Delivery Location (Pin on Map)</h2>
              <div
                ref={mapEl}
                style={{
                  width: '100%',
                  height: 250,
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(46,125,50,0.2)',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}
              />
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {markerCoord
                  ? <>📍 {user.address || "Fetching address..."}</>
                  : 'Click on the map to drop your delivery pin, or type your address manually.'}
              </p>
            </>
          )}
        </section>

        {/* Right: User details + Actions */}
        <section 
          className="cart-section"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginBottom: "1.5rem"
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontSize: "1.3rem", color: "#2c3e50" }}>
            Buyer Details
          </h2>

          <div className="product-info" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", color: "#444" }}>
              Name
              <input
                type="text"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value.trimStart() })}
                style={{
                  marginTop: "6px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "0.95rem"
                }}
                placeholder="Your name"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", color: "#444" }}>
              Phone
              <input
                type="text"
                value={user.phone || ""}
                onChange={e => setUser({ ...user, phone: e.target.value.trim() })}
                style={{
                  marginTop: "6px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "0.95rem"
                }}
                placeholder="10-digit phone number"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", color: "#444" }}>
              Email
              <input
                type="email"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value.trim() })}
                style={{
                  marginTop: "6px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "0.95rem"
                }}
                placeholder="you@example.com"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", color: "#444" }}>
              Address
              <textarea
                value={user.address}
                onChange={e => setUser({ ...user, address: e.target.value })}
                style={{
                  marginTop: "6px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "0.95rem",
                  resize: "vertical"
                }}
                rows={3}
                placeholder="Street, city"
              />
            </label>
          </div>

          <button className="checkout-btn" onClick={handlePay} style={{ marginTop: "1rem" }}>
            Set Order
          </button>
          <button className="clear-cart-btn" onClick={handleUpdateCart} style={{ marginTop: 8 }}>
            Update Cart
          </button>
        </section>
      </div>

      {/* ✅ Shared Footer */}
      <Footer />
    </div>
  );
}
