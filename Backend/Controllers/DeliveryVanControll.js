// deliveryVanControll.js

const DeliveryVan = require('../Model/DeliveryVanModel');

// CREATE a new delivery van
exports.createVan = async (req, res) => {
    try {
        const van = new DeliveryVan(req.body);
        await van.save();
        res.status(201).json({ message: 'Delivery van added successfully', van });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    if(!van){
        return res.status(404).send({message:"unable to add users"});
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


