const express = require("express");
const router = express.Router();
const AttendanceController = require("../Controllers/AttendanceController");

// register employee
router.post("/register-face", AttendanceController.registerFace);

// mark attendance
router.post("/mark-attendance", AttendanceController.markAttendance);

// get all logs
router.get("/", AttendanceController.getAttendance);

module.exports = router;
