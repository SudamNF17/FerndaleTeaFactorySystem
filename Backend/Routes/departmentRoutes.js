const express = require("express");
const router = express.Router();
const deptController = require("../Controllers/departmentController");

router.get("/", deptController.getDepartments);
router.post("/", deptController.createDepartment);
router.put("/:id", deptController.updateDepartment);
router.delete("/:id", deptController.deleteDepartment);

// ✅ New route to update performance dynamically
router.put("/update-performance/all", deptController.updatePerformance);

module.exports = router;
