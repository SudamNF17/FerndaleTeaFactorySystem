const Process = require("../Model/Process");

// @desc    Get all processes
exports.getProcesses = async (req, res) => {
  try {
    const processes = await Process.find();
    res.json({ processes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Create new process
exports.createProcess = async (req, res) => {
  try {
    const process = new Process(req.body);
    await process.save();
    res.status(201).json({ process });
  } catch (err) {
    res.status(400).json({ message: "Failed to create process", error: err.message });
  }
};

// @desc    Update process by ID
exports.updateProcess = async (req, res) => {
  try {
    const process = await Process.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ process });
  } catch (err) {
    res.status(400).json({ message: "Failed to update process", error: err.message });
  }
};

// @desc    Delete process by ID
exports.deleteProcess = async (req, res) => {
  try {
    await Process.findByIdAndDelete(req.params.id);
    res.json({ message: "Process deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete process", error: err.message });
  }
};
