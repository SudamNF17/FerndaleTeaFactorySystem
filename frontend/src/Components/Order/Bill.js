// src/Bill.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Bill() {
  const navigate = useNavigate();

  const cart = useMemo(() => JSON.parse(localStorage.getItem('cart') || '[]'), []);
  const totals = useMemo(() => JSON.parse(localStorage.getItem('totals') || '{}'), []);
  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);
  const location = useMemo(() => JSON.parse(localStorage.getItem('location') || 'null'), []);

  if (!cart.length || !user.name) {
    return (
      <div className="cart-app">
        <h2>No bill found</h2>
        <button onClick={() => navigate('/')}>Back to Cart</button>
      </div>
    );
  }

  const billText = `
  🧾 TeaCart Bill
  --------------------
  Name: ${user.name}
  Email: ${user.email}
  Address: ${user.address}
  
  Products:
  ${cart.map(i => `- ${i.name} x${i.qty} = $${i.price * i.qty}`).join('\n')}
  
  Subtotal: $${totals.subtotal}
  Shipping: $${totals.shipping}
  Total: $${totals.total}
  
  Delivery Location: ${location ? `Lat: ${location[1].toFixed(5)}, Lon: ${location[0].toFixed(5)}` : 'Not set'}
  `;

  // WhatsApp link
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(billText)}`;

  // Email link
  const emailLink = `mailto:${user.email}?subject=Your TeaCart Bill&body=${encodeURIComponent(billText)}`;

  return (
    <div className="cart-app">
      <header className="app-header">
        <h1>Bill</h1>
      </header>

      <div className="content-container" style={{ gridTemplateColumns: '1fr' }}>
        <section className="cart-section">
          <h2>Buyer Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>

          <h2 style={{ marginTop: '1rem' }}>Products</h2>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} × {item.qty} = ${item.price * item.qty}
              </li>
            ))}
          </ul>

          <h2>Summary</h2>
          <p>Subtotal: ${totals.subtotal}</p>
          <p>Shipping: ${totals.shipping}</p>
          <p><strong>Total: ${totals.total}</strong></p>

          <h2>Delivery Location</h2>
          {location ? (
            <p>Lat: {location[1].toFixed(5)}, Lon: {location[0].toFixed(5)}</p>
          ) : (
            <p>No location pinned</p>
          )}

          <div style={{ marginTop: '1rem' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="checkout-btn">
              Send via WhatsApp
            </a>
            <br />
            <a href={emailLink} className="clear-cart-btn" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
              Send via Email
            </a>
          </div>

          <button
            style={{ marginTop: '1rem' }}
            className="checkout-btn"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </section>
      </div>
    </div>
  );
}
