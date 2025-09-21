import React from "react";
import "./Orderdashboard.css";

export default function OrderCard({ order, onStatusChange, onBuyerUpdate, onDelete }) {
  return (
    <div className="order-card">
      <p><b>Buyer:</b> {order.buyer.name}</p>
      <input
        type="text"
        defaultValue={order.buyer.phone}
        onBlur={(e) => onBuyerUpdate(order._id, { ...order.buyer, phone: e.target.value })}
      />
      <textarea
        defaultValue={order.buyer.address}
        onBlur={(e) => onBuyerUpdate(order._id, { ...order.buyer, address: e.target.value })}
      />
      <div className="card-actions">
        {order.status !== "accepted" && (
          <button onClick={() => onStatusChange(order._id, "accepted")} className="btn btn-accept">
            Accept
          </button>
        )}
        {order.status !== "cancelled" && (
          <button onClick={() => onStatusChange(order._id, "cancelled")} className="btn btn-cancel">
            Cancel
          </button>
        )}
        <button onClick={() => onDelete(order._id)} className="btn btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}
