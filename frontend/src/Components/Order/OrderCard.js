import React from "react";

export default function OrderCard({ order, onStatusChange, onBuyerUpdate, onDelete }) {
  return (
    <div className="p-3 border rounded-lg mb-2 bg-gray-50">
      <p><b>Buyer:</b> {order.buyer.name}</p>
      <input
        type="text"
        defaultValue={order.buyer.phone}
        onBlur={(e) => onBuyerUpdate(order._id, { ...order.buyer, phone: e.target.value })}
        className="border p-1 w-full mb-1"
      />
      <textarea
        defaultValue={order.buyer.address}
        onBlur={(e) => onBuyerUpdate(order._id, { ...order.buyer, address: e.target.value })}
        className="border p-1 w-full"
      />

      <div className="flex gap-2 mt-2">
        {order.status !== "accepted" && (
          <button onClick={() => onStatusChange(order._id, "accepted")} className="bg-green-500 text-white px-2 py-1 rounded">
            Accept
          </button>
        )}
        {order.status !== "cancelled" && (
          <button onClick={() => onStatusChange(order._id, "cancelled")} className="bg-red-500 text-white px-2 py-1 rounded">
            Cancel
          </button>
        )}
        <button onClick={() => onDelete(order._id)} className="bg-gray-500 text-white px-2 py-1 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}
