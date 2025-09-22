// src/Bill.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Bill() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch order");
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading bill...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;
  if (!order || !order.buyer) {
    return (
      <div className="cart-app">
        <Header />
        <h2>No bill found</h2>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
        <Footer />
      </div>
    );
  }

  const billText = `
  🧾 TeaCart Bill
  --------------------
  Name: ${order.buyer.name}
  Email: ${order.buyer.email}
  Address: ${order.buyer.address}
  
  Products:
  ${order.cart.map(i => `- ${i.name} x${i.qty} = $${i.price * i.qty}`).join("\n")}
  
  Subtotal: $${order.totals.subtotal}
  Shipping: $${order.totals.shipping}
  Total: $${order.totals.total}
  
  Delivery Location: ${
    order.deliveryLocation
      ? `Lat: ${order.deliveryLocation.lat}, Lon: ${order.deliveryLocation.lng}`
      : "Not set"
  }
  `;

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(billText)}`;
  const emailLink = `mailto:${order.buyer.email}?subject=Your TeaCart Bill&body=${encodeURIComponent(billText)}`;

  return (
    <div className="cart-app">
      {/* ✅ Reusable Header */}
      <Header />

      <div className="content-container" style={{ gridTemplateColumns: "1fr" }}>
        <section className="cart-section">
          <h2>Buyer Details</h2>
          <p><strong>Name:</strong> {order.buyer.name}</p>
          <p><strong>Email:</strong> {order.buyer.email}</p>
          <p><strong>Address:</strong> {order.buyer.address}</p>

          <h2 style={{ marginTop: "1rem" }}>Products</h2>
          <ul>
            {order.cart.map(item => (
              <li key={item.id}>
                {item.name} × {item.qty} = ${item.price * item.qty}
              </li>
            ))}
          </ul>

          <h2>Summary</h2>
          <p>Subtotal: ${order.totals.subtotal}</p>
          <p>Shipping: ${order.totals.shipping}</p>
          <p><strong>Total: ${order.totals.total}</strong></p>

          <h2>Delivery Location</h2>
          {order.deliveryLocation ? (
            <p>
              Lat: {order.deliveryLocation.lat}, Lon: {order.deliveryLocation.lng}
            </p>
          ) : (
            <p>No location pinned</p>
          )}

          <div style={{ marginTop: "1rem" }}>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-btn"
            >
              Send via WhatsApp
            </a>
            <br />
            <a
              href={emailLink}
              className="clear-cart-btn"
              style={{ marginTop: "0.5rem", display: "inline-block" }}
            >
              Send via Email
            </a>
          </div>

          <button
            style={{ marginTop: "1rem" }}
            className="checkout-btn"
            onClick={() => navigate("/cart")}
          >
            Back to Home
          </button>
        </section>
      </div>

      {/* ✅ Reusable Footer */}
      <Footer />
    </div>
  );
}
