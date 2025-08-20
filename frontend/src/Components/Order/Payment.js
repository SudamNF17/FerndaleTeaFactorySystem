// src/Payment.jsx  (use .js if you prefer)
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

export default function Payment() {
  const navigate = useNavigate();

  // ---- Read persisted data (do NOT modify cart here) ----
  const cart = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  }, []);

  const totalsFromLS = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('totals') || '{}'); } catch { return {}; }
  }, []);

  // Fallback totals if LS doesn't have them yet
  const totals = useMemo(() => {
    if (totalsFromLS && typeof totalsFromLS.total === 'number') return totalsFromLS;
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [cart, totalsFromLS]);

  // Restore user + location if present
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || { name: '', email: '', address: '' }; }
    catch { return { name: '', email: '', address: '' }; }
  });
  const [markerCoord, setMarkerCoord] = useState(() => {
    try { return JSON.parse(localStorage.getItem('location') || 'null'); } catch { return null; }
  }); // [lon, lat]

  // ---- Map setup ----
  const mapEl = useRef(null);
  const mapRef = useRef(null);
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
    map.on('click', (evt) => {
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
    });

    mapRef.current = map;
    return () => map.setTarget(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Actions ----
const handlePay = async () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items first.');
    return;
  }
  if (!user.name || !user.email || !user.address) {
    alert('Please fill in your name, email, and address.');
    return;
  }
  if (!markerCoord) {
    alert('Please pin your delivery location on the map.');
    return;
  }

  // Prepare order data for backend
  const orderData = {
    buyer: {
      name: user.name,
      email: user.email,
      phone: user.phone || "N/A", // in case phone is not collected yet
      address: user.address,
    },
    cart: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    })),
    totals: totals,
    deliveryLocation: {
  lat: markerCoord[1],
  lng: markerCoord[0],
},
 // { lat, lng }
  };

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (res.ok) {
  const savedOrder = data.order;
  navigate(`/bill/${savedOrder._id}`);   // ✅ send order ID in the URL
}
else {
      alert("❌ Failed to place order: " + data.message);
    }
  } catch (err) {
    alert("❌ Error placing order: " + err.message);
  }
};


  const handleUpdateCart = () => {
    // Save any current inputs so they’re still there when you come back
    localStorage.setItem('user', JSON.stringify(user));
    if (markerCoord) localStorage.setItem('location', JSON.stringify(markerCoord));

    // Safest way back to the previous page (usually the Cart):
    navigate(-1);
    // If you prefer a fixed route instead, use:
    // navigate('/');
  };

  return (
    <div className="cart-app">
      <header className="app-header">
        <h1>Payment</h1>
        <div className="cart-indicator">
          <span>{cart.reduce((t, i) => t + (i.qty || 0), 0)} items</span>
        </div>
      </header>

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
                  ? <>Pinned at <strong>Lat:</strong> {markerCoord[1].toFixed(5)}, <strong>Lon:</strong> {markerCoord[0].toFixed(5)}</>
                  : 'Click on the map to drop your delivery pin.'}
              </p>
            </>
          )}
        </section>

        {/* Right: User details + Actions */}
        <section className="cart-section">
          <h2>Buyer Details</h2>
          <div className="product-info">
            <label style={{ display: 'block', marginBottom: 8 }}>
              Name
              <input
                type="text"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                className="input"
                placeholder="Your name"
              />
            </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            Phone
            <input
              type="text"
              value={user.phone || ""}
              onChange={e => setUser({ ...user, phone: e.target.value })}
              className="input"
              placeholder="Your phone number"
            />
          </label>



            <label style={{ display: 'block', marginBottom: 8 }}>
              Email
              <input
                type="email"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
                className="input"
                placeholder="you@example.com"
              />
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Address
              <textarea
                value={user.address}
                onChange={e => setUser({ ...user, address: e.target.value })}
                className="input"
                rows={3}
                placeholder="Street, city"
              />
            </label>
          </div>

          <button className="checkout-btn" onClick={handlePay}>
            Pay
          </button>
          <button className="clear-cart-btn" onClick={handleUpdateCart} style={{ marginTop: 8 }}>
            Update Cart
          </button>
        </section>
      </div>
    </div>
  );
}
