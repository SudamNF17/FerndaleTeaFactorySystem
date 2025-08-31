import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // ✅ Update totals when cart changes
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

  // Handle input changes
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

  // Submit new order
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

  // Change order status
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HR Manager Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["pending", "accepted", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
          </button>
        ))}
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "make" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("make")}
        >
          + Make Order
        </button>
      </div>

      {/* Orders List */}
      {activeTab !== "make" && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Buyer</th>
                <th className="p-2 border">Items</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((o) => o.status === activeTab)
                .map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="p-2 border">{o.buyer.name}</td>
                    <td className="p-2 border">
                      {o.cart.map((item, i) => (
                        <div key={i}>
                          {item.name} × {item.qty}
                        </div>
                      ))}
                    </td>
                    <td className="p-2 border">${o.totals.total}</td>
                    <td className="p-2 border text-center space-x-2">
                      {activeTab === "pending" && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(o._id, "accepted")}
                            className="px-3 py-1 bg-green-500 text-white rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(o._id, "cancelled")}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {activeTab === "accepted" && (
                        <button
                          onClick={() => updateOrderStatus(o._id, "cancelled")}
                          className="px-3 py-1 bg-red-500 text-white rounded"
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Make a New Order</h2>

          {/* Buyer Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Buyer Name"
              value={newOrder.buyer.name}
              onChange={handleBuyerChange}
              className="p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Buyer Email"
              value={newOrder.buyer.email}
              onChange={handleBuyerChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Buyer Phone"
              value={newOrder.buyer.phone}
              onChange={handleBuyerChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Buyer Address"
              value={newOrder.buyer.address}
              onChange={handleBuyerChange}
              className="p-2 border rounded"
            />
          </div>

          {/* Cart Items */}
          <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newOrder.cart.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleCartChange(index, "name", e.target.value)
                      }
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleCartChange(index, "price", e.target.value)
                      }
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleCartChange(index, "qty", e.target.value)
                      }
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => removeCartRow(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addCartRow}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Add Item
          </button>

          {/* Totals */}
          <div className="mb-4">
            <p>Subtotal: ${newOrder.totals.subtotal}</p>
            <p>Shipping: ${newOrder.totals.shipping}</p>
            <p className="font-bold">Total: ${newOrder.totals.total}</p>
          </div>

          {/* Submit */}
          <button
            onClick={submitOrder}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold"
          >
            ✅ Place Order
          </button>
        </div>
      )}
    </div>
  );
}
