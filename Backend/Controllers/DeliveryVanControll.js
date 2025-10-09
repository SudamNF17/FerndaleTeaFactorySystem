// deliveryVanControll.js

const DeliveryVan = require('../Model/DeliveryVanModel');

// ================= In-Memory Subscribers for SSE =================
// Map<string, Set<Response>> keyed by vanId
const vanSubscribers = new Map();

function addSubscriber(vanId, res) {
  if (!vanSubscribers.has(vanId)) {
    vanSubscribers.set(vanId, new Set());
  }
  vanSubscribers.get(vanId).add(res);
}

function removeSubscriber(vanId, res) {
  const set = vanSubscribers.get(vanId);
  if (set) {
    set.delete(res);
    if (set.size === 0) vanSubscribers.delete(vanId);
  }
}

async function notifySubscribersByVanId(vanId) {
  try {
    const van = await DeliveryVan.findById(vanId);
    if (!van) return;
    const set = vanSubscribers.get(String(vanId));
    if (!set || set.size === 0) return;
    const payload = `data: ${JSON.stringify(van)}\n\n`;
    for (const res of set) {
      res.write(payload);
    }
  } catch (err) {
    // no-op
  }
}

// CREATE a new delivery van
exports.createVan = async (req, res) => {
    try {
        const van = new DeliveryVan(req.body);
        await van.save();
        return res.status(201).json({ message: 'Delivery van added successfully', van });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// READ - Get all delivery vans
exports.getAllVans = async (req, res) => {
    try {
        const vans = await DeliveryVan.find(); //display
        //not Found
        if (!vans || vans.length === 0) {
            return res.status(404).json({ message: "No vans found" });
        }
        res.status(200).json(vans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
};

// READ - Get single delivery van by ID
exports.getVanById = async (req, res) => {
    try {
        const van = await DeliveryVan.findById(req.params.id);
        if (!van) {
            return res.status(404).json({ message: 'Delivery van not found' });
        }
        // Disable caching so clients always get fresh coordinates
        res.set('Cache-Control', 'no-store');
        res.status(200).json(van);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// UPDATE a delivery van
exports.updateVan = async (req, res) => {
    try {
        const van = await DeliveryVan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!van) {
            return res.status(404).json({ message: 'Delivery van not found' });
        }
        res.status(200).json({ message: 'Delivery van updated successfully', van });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE a delivery van
exports.deleteVan = async (req, res) => {
    try {
        const van = await DeliveryVan.findByIdAndDelete(req.params.id);
        if (!van) {
            return res.status(404).json({ message: 'Delivery van not found' });
        }
        res.status(200).json({ message: 'Delivery van deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const van = await DeliveryVan.findByIdAndUpdate(
      req.params.id,
      { latitude, longitude },  // match schema fields
      { new: true }
    );
    if (!van) {
      return res.status(404).json({ message: 'Delivery van not found' });
    }
    // Notify SSE subscribers
    notifySubscribersByVanId(String(van._id));
    return res.json(van);
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(500).json({ message: "Failed to update location" });
  }
};

// UPDATE location by van_number (for mobile apps that only know the van number)
exports.updateLocationByVanNumber = async (req, res) => {
  const { van_number } = req.params;
  const { latitude, longitude } = req.body;
  try {
    const van = await DeliveryVan.findOneAndUpdate(
      { van_number },
      { latitude, longitude },
      { new: true }
    );
    if (!van) {
      return res.status(404).json({ message: 'Delivery van not found' });
    }
    notifySubscribersByVanId(String(van._id));
    return res.json(van);
  } catch (err) {
    console.error('Error updating location by van_number:', err);
    return res.status(500).json({ message: 'Failed to update location' });
  }
};

// UPDATE location by delivery_person_id (numeric code driver can use)
exports.updateLocationByDriverId = async (req, res) => {
  const { driverId } = req.params;
  const { latitude, longitude } = req.body;
  try {
    const van = await DeliveryVan.findOneAndUpdate(
      { delivery_person_id: Number(driverId) },
      { latitude, longitude },
      { new: true }
    );
    if (!van) {
      return res.status(404).json({ message: 'Delivery van not found' });
    }
    notifySubscribersByVanId(String(van._id));
    return res.json(van);
  } catch (err) {
    console.error('Error updating location by driver id:', err);
    return res.status(500).json({ message: 'Failed to update location' });
  }
};

// UPDATE location by van_number (for mobile apps using van_number as ID)
exports.updateLocationByVanNumber = async (req, res) => {
  const { vanNumber } = req.params;
  const { latitude, longitude } = req.body;
  try {
    const van = await DeliveryVan.findOneAndUpdate(
      { van_number: vanNumber },
      { latitude, longitude },
      { new: true }
    );
    if (!van) {
      return res.status(404).json({ message: 'Delivery van not found' });
    }
    notifySubscribersByVanId(String(van._id));
    return res.json(van);
  } catch (err) {
    console.error('Error updating location by van number:', err);
    return res.status(500).json({ message: 'Failed to update location' });
  }
};

// CREATE demo van for testing (van ID 1111)
exports.createDemoVan = async (req, res) => {
  try {
    // Check if demo van already exists
    let van = await DeliveryVan.findOne({ van_number: "1111" });
    
    if (!van) {
      // Create demo van
      van = new DeliveryVan({
        delivery_person_id: 1111,
        name: "Demo Driver",
        phone_number: "+94123456789",
        email: "demo@teafactory.com",
        van_number: "1111",
        availability_status: "Available",
        notes: "Demo van for GPS tracking testing",
        latitude: 9.6615, // Default Jaffna coordinates
        longitude: 80.0255
      });
      await van.save();
      return res.status(201).json({ 
        message: 'Demo van created successfully', 
        van,
        instructions: {
          mobileApp: `Use MongoDB ObjectId ${van._id} in your mobile app`,
          frontend: "Track this van using the Track button",
          apiEndpoint: `PUT /api/delivery-vans/${van._id}/location`,
          vanNumber: "1111",
          mongoId: van._id
        }
      });
    } else {
      return res.status(200).json({ 
        message: 'Demo van already exists', 
        van,
        instructions: {
          mobileApp: `Use MongoDB ObjectId ${van._id} in your mobile app`,
          frontend: "Track this van using the Track button",
          apiEndpoint: `PUT /api/delivery-vans/${van._id}/location`,
          vanNumber: "1111",
          mongoId: van._id
        }
      });
    }
  } catch (err) {
    console.error('Error creating demo van:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ================ SSE Streams ================
exports.streamById = async (req, res) => {
  const vanId = String(req.params.id);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  addSubscriber(vanId, res);

  // Send initial data
  try {
    const van = await DeliveryVan.findById(vanId);
    if (van) {
      res.write(`data: ${JSON.stringify(van)}\n\n`);
    }
  } catch (_) {}

  req.on('close', () => {
    removeSubscriber(vanId, res);
    try { res.end(); } catch (_) {}
  });
};

exports.streamByVanNumber = async (req, res) => {
  const { van_number } = req.params;
  try {
    const van = await DeliveryVan.findOne({ van_number });
    if (!van) return res.status(404).end();
    req.params.id = String(van._id);
    return exports.streamById(req, res);
  } catch (err) {
    return res.status(500).end();
  }
};

exports.streamByDriverId = async (req, res) => {
  const { driverId } = req.params;
  try {
    const van = await DeliveryVan.findOne({ delivery_person_id: Number(driverId) });
    if (!van) return res.status(404).end();
    req.params.id = String(van._id);
    return exports.streamById(req, res);
  } catch (err) {
    return res.status(500).end();
  }
};



