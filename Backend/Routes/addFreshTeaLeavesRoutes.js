const express = require("express");
const router = express.Router();
const controller = require("../Controllers/addFreshTeaLeavesController");
const nodemailer = require("nodemailer");
const AddFreshTeaLeaves = require("../Model/addFreshTeaLeavesModel");

router.get("/", controller.getAllLeaves);
router.post("/", controller.createLeaves);
router.put("/:id", controller.updateLeaves);
router.delete("/:id", controller.deleteLeaves);

// Email configuration with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sasankainventory@gmail.com",
    pass: "uwbi irwr midm yyls",
  },
});

// Generate comprehensive HTML email for fresh tea leaves inventory
const generateInventoryEmail = (leaf) => {
  const receivedDate = new Date(leaf.receivedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          color: #2d5016;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #4a7c2c;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
        }
        .info-item {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #4a7c2c;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          color: #2d5016;
          font-weight: 600;
        }
        .total-box {
          background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .total-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 5px;
        }
        .total-amount {
          font-size: 32px;
          font-weight: 700;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .footer p {
          margin: 5px 0;
          font-size: 13px;
          color: #666;
        }
        .highlight {
          background: #fff3cd;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #ffc107;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🍃 Fresh Tea Leaves Inventory Record</h1>
        <p>Ferndale Tea Factory System</p>
      </div>

      <div class="content">
        <div class="section">
          <div class="section-title">Supplier Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Supplier Name</div>
              <div class="info-value">${leaf.supplierName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Contact Email</div>
              <div class="info-value">${leaf.email}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Record ID</div>
              <div class="info-value">#${leaf._id.toString().slice(-8).toUpperCase()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Received Date</div>
              <div class="info-value">${receivedDate}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Tea Leaves Details</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Weight</div>
              <div class="info-value">${leaf.weight.toFixed(2)} kg</div>
            </div>
            <div class="info-item">
              <div class="info-label">Price per Kg</div>
              <div class="info-value">Rs. ${leaf.pricePerKg.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div class="total-box">
          <div class="total-label">Total Price</div>
          <div class="total-amount">Rs. ${leaf.totalPrice.toFixed(2)}</div>
        </div>

        <div class="highlight">
          <strong>📋 Note:</strong> This is a comprehensive inventory record for fresh tea leaves received from ${leaf.supplierName}. Please retain this email for your records.
        </div>

        <div class="section">
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This email contains important information about your fresh tea leaves supply to Ferndale Tea Factory. 
            If you have any questions or concerns, please contact our inventory department.
          </p>
        </div>
      </div>

      <div class="footer">
        <p><strong>Ferndale Tea Factory</strong></p>
        <p>📧 sasankainventory@gmail.com</p>
        <p>🌐 Quality Tea Since 1995</p>
        <p style="margin-top: 15px; font-size: 11px; color: #999;">
          This is an automated email from Ferndale Tea Factory Inventory System.
        </p>
      </div>
    </body>
    </html>
  `;
};

// Send email for a single inventory record
router.post("/:id/send-email", async (req, res) => {
  try {
    const leaf = await AddFreshTeaLeaves.findById(req.params.id);
    
    if (!leaf) {
      return res.status(404).json({ message: "Inventory record not found" });
    }

    if (!leaf.email) {
      return res.status(400).json({ message: "No email address found for this supplier" });
    }

    const mailOptions = {
      from: '"Ferndale Tea Factory Inventory" <sasankainventory@gmail.com>',
      to: leaf.email,
      subject: `🍃 Fresh Tea Leaves Inventory Record - ${leaf.supplierName}`,
      html: generateInventoryEmail(leaf),
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Email sent successfully",
      sentTo: leaf.email,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// Send bulk emails for multiple inventory records
router.post("/send-bulk-emails", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Please provide an array of inventory IDs" });
    }

    const results = {
      successCount: 0,
      errorCount: 0,
      errors: [],
    };

    for (const id of ids) {
      try {
        const leaf = await AddFreshTeaLeaves.findById(id);
        
        if (!leaf || !leaf.email) {
          results.errorCount++;
          results.errors.push({ id, error: "Record not found or no email" });
          continue;
        }

        const mailOptions = {
          from: '"Ferndale Tea Factory Inventory" <sasankainventory@gmail.com>',
          to: leaf.email,
          subject: `🍃 Fresh Tea Leaves Inventory Record - ${leaf.supplierName}`,
          html: generateInventoryEmail(leaf),
        };

        await transporter.sendMail(mailOptions);
        results.successCount++;
      } catch (error) {
        results.errorCount++;
        results.errors.push({ id, error: error.message });
      }
    }

    res.status(200).json({
      message: "Bulk email sending completed",
      ...results,
    });
  } catch (error) {
    console.error("Error in bulk email sending:", error);
    res.status(500).json({
      message: "Failed to send bulk emails",
      error: error.message,
    });
  }
});

module.exports = router;
