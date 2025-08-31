const router = require("express").Router();
const {
  getAttendanceRecords,
  getAttendanceById,
  addAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} = require("../Controllers/AttendanceController");

router.get("/", getAttendanceRecords);
router.get("/:id", getAttendanceById);
router.post("/", addAttendanceRecord);
router.put("/:id", updateAttendanceRecord);
router.delete("/:id", deleteAttendanceRecord);

module.exports = router;
