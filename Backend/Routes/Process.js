const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getProcesses,
  createProcess,
  updateProcess,
  deleteProcess,
} = require("../Controllers/Process");

// ✅ GET all processes
router.get("/", async (req, res, next) => {
  try {
    await getProcesses(req, res);
  } catch (err) {
    next(err);
  }
});

// ✅ POST new process
router.post("/", async (req, res, next) => {
  try {
    await createProcess(req, res);
  } catch (err) {
    next(err);
  }
});

// ✅ PUT update process by ID
router.put("/:id", async (req, res, next) => {
  try {
    await updateProcess(req, res);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE process by ID
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteProcess(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
