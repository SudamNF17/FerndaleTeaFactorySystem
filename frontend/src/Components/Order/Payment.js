// src/Payment.jsx
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
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }));
  const [markerCoord, setMarkerCoord] = useState(null); // [lon, lat] in EPSG:4326

  const cart = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  }, []);
  const totals = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('totals') || '{}'); } catch { return {}; }
  }, []);

  // Basic user form state
  const [user, setUser] = useState({ name: '', email: '', address: '' });

  useEffect(() => {
    if (!mapEl.current) return;

    // Default center (Colombo, Sri Lanka) – adjust if you like
    const defaultCenter = fromLonLat([79.8612, 6.9271]);

    const map = new Map({
      target: mapEl.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayerRef.current
      ],
      view: new View({
        center: defaultCenter,
        zoom: 12,
      }),
      controls: [],
    });

    // Handle click to add/move marker
    map.on('click', (evt) => {
      const coord = evt.coordinate; // EPSG:3857
      // Clear previous marker
      vectorSourceRef.current.clear();

      // Create new marker feature
      const feature = new Feature({
        geometry: new Point(coord)
      });

      feature.setStyle(new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          anchor: [0.5, 1],
          scale: 0.08
        })
      }));

      vectorSourceRef.current.addFeature(feature);

      // Save lon/lat
      const [lon, lat] = toLonLat(coord);
      setMarkerCoord([lon, lat]);
    });

    mapRef.current = map;

    return () => {
      map.setTarget(null);
    };
  }, []);

  const handlePay = () => {
  if (!user.name || !user.email || !user.address) {
    alert('Please fill in your name, email, and address.');
    return;
  }
  if (!markerCoord) {
    alert('Please pin your delivery location on the map.');
    return;
  }

  // Save payment info for the bill
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('location', JSON.stringify(markerCoord));

  navigate('/bill');
};


  const goBackToCart = () => {
    navigate('/cart');
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
            <p>Your cart is empty. <button className="clear-cart-btn" onClick={goBackToCart}>Update Cart</button></p>
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
          <button className="clear-cart-btn" onClick={goBackToCart} style={{ marginTop: 8 }}>
            Update Cart
          </button>
        </section>
      </div>
    </div>
  );
}
