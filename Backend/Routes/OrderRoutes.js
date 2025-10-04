const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");
const nodemailer = require("nodemailer");

// ==================== EMAIL SERVICE ====================
async function sendEmail(to, subject, text) {
  // Create Ethereal test account
  let testAccount = await nodemailer.createTestAccount();

  // Setup transporter
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send mail
  let info = await transporter.sendMail({
    from: '"Ferndale Tea Factory" <no-reply@teafactory.com>',
    to,
    subject,
    text,
  });

  console.log("✅ Email sent:", info.messageId);
  console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
}

// ==================== ROUTES ====================

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "✅ Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to place order", error: err.message });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch orders", error: err.message });
  }
});

// GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "❌ Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch order", error: err.message });
  }
});

// UPDATE ORDER STATUS + SEND EMAILS
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "accepted", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "❌ Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    // 📧 Send email to customer
    await sendEmail(
      updatedOrder.buyer.email,
      `Your order has been ${status}`,
      `Hello ${updatedOrder.buyer.name},\n\nYour order is now marked as ${status}.\n\nThank you for shopping with Ferndale Tea Factory 🍃`
    );

    // 📧 Send email to inventory manager
    await sendEmail(
      `${updatedOrder.buyer.email}`,
      `Your Order #${updatedOrder._id} is now ${status}`,
      `Order #${updatedOrder._id} by ${updatedOrder.buyer.name} (${updatedOrder.buyer.email}) has been updated to status: ${status}.`
    );

    res.json({ message: "✅ Status updated & emails sent", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to update status", error: err.message });
  }
});

// UPDATE FULL ORDER
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    res.json({ message: "✅ Order updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to update order", error: err.message });
  }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    res.json({ message: "✅ Order deleted", order: deletedOrder });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to delete order", error: err.message });
  }
});

module.exports = router;
