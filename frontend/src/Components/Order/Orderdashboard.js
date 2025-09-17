import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orderdashboard.css"; // Import external CSS
import OrderCard from "./OrderCard";

export default function Orderdashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [newOrder, setNewOrder] = useState({
    buyer: { name: "", email: "", phone: "", address: "" },
    cart: [{ name: "", price: 0, qty: 1 }],
    totals: { subtotal: 0, shipping: 0, total: 0 },
    deliveryLocation: { lat: 0, lng: 0 },
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update totals when cart changes
  useEffect(() => {
    setNewOrder((prev) => {
      const subtotal = prev.cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      const shipping = subtotal > 0 ? 5 : 0;
      return {
        ...prev,
        totals: { subtotal, shipping, total: subtotal + shipping },
      };
    });
  }, [newOrder.cart]);

  // Handlers
  const handleBuyerChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      buyer: { ...prev.buyer, [name]: value },
    }));
  };

  const handleCartChange = (index, field, value) => {
    setNewOrder((prev) => {
      const updatedCart = [...prev.cart];
      updatedCart[index][field] =
        field === "price" || field === "qty" ? Number(value) : value;
      return { ...prev, cart: updatedCart };
    });
  };

  const addCartRow = () => {
    setNewOrder((prev) => ({
      ...prev,
      cart: [...prev.cart, { name: "", price: 0, qty: 1 }],
    }));
  };

  const removeCartRow = (index) => {
    setNewOrder((prev) => {
      const updatedCart = prev.cart.filter((_, i) => i !== index);
      return { ...prev, cart: updatedCart };
    });
  };

  const submitOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders", newOrder);
      fetchOrders();
      alert("✅ Order created successfully");
      setNewOrder({
        buyer: { name: "", email: "", phone: "", address: "" },
        cart: [{ name: "", price: 0, qty: 1 }],
        totals: { subtotal: 0, shipping: 0, total: 0 },
        deliveryLocation: { lat: 0, lng: 0 },
      });
    } catch (err) {
      console.error("❌ Failed to create order:", err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, {
        status,
      });
      fetchOrders();
    } catch (err) {
      console.error(`❌ Failed to update order status to ${status}:`, err);
    }
  };

  // Generate CSV Report
  const generateReport = () => {
    if (orders.length === 0) {
      alert("No orders to generate report.");
      return;
    }

    let csvContent =
      "Buyer,Email,Phone,Address,Items,Subtotal,Shipping,Total,Status,Date\n";

    orders.forEach((order) => {
      const items = order.cart.map((i) => `${i.name} x${i.qty}`).join("; ");
      csvContent += `"${order.buyer.name}","${order.buyer.email}","${order.buyer.phone}","${order.buyer.address}","${items}",${order.totals.subtotal},${order.totals.shipping},${order.totals.total},${order.status},${new Date(order.createdAt).toLocaleString()}\n`;
    });

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">HR Manager Dashboard</h1>

      {/* Tabs */}
      <div className="tab-container">
        {["pending", "accepted", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
          </button>
        ))}
        <button
          className={`tab-button make-order ${
            activeTab === "make" ? "active" : ""
          }`}
          onClick={() => setActiveTab("make")}
        >
          + Make Order
        </button>
      </div>

      {/* Orders List */}
      {activeTab !== "make" && (
        <div className="card">
          <div className="card-header">
            <h2>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders
            </h2>
            <button onClick={generateReport} className="btn btn-report">
              📄 Generate Report
            </button>
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((o) => o.status === activeTab)
                .map((o) => (
                  <tr key={o._id}>
                    <td>{o.buyer.name}</td>
                    <td>
                      {o.cart.map((item, i) => (
                        <div key={i}>
                          {item.name} × {item.qty}
                        </div>
                      ))}
                    </td>
                    <td>${o.totals.total}</td>
                    <td className="action-buttons">
                      {activeTab === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(o._id, "accepted")
                            }
                            className="btn btn-accept"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(o._id, "cancelled")
                            }
                            className="btn btn-cancel"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {activeTab === "accepted" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(o._id, "cancelled")
                          }
                          className="btn btn-cancel"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Make Order */}
      {activeTab === "make" && (
        <div className="card">
          <h2>Make a New Order</h2>

          {/* Buyer Info */}
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Buyer Name"
              value={newOrder.buyer.name}
              onChange={handleBuyerChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Buyer Email"
              value={newOrder.buyer.email}
              onChange={handleBuyerChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Buyer Phone"
              value={newOrder.buyer.phone}
              onChange={handleBuyerChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Buyer Address"
              value={newOrder.buyer.address}
              onChange={handleBuyerChange}
            />
          </div>

          {/* Cart Items */}
          <h3>Cart Items</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newOrder.cart.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleCartChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleCartChange(index, "price", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleCartChange(index, "qty", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => removeCartRow(index)}
                      className="btn btn-cancel"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addCartRow} className="btn btn-add">
            + Add Item
          </button>

          {/* Totals */}
          <div className="totals">
            <p>Subtotal: ${newOrder.totals.subtotal}</p>
            <p>Shipping: ${newOrder.totals.shipping}</p>
            <p className="total">Total: ${newOrder.totals.total}</p>
          </div>

          {/* Submit */}
          <button onClick={submitOrder} className="btn btn-submit">
            ✅ Place Order
          </button>
        </div>
      )}
    </div>
  );
}
