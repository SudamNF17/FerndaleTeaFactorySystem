const router = require("express").Router();
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  toggleActive,
  getDepartmentSummary,
} = require("../controllers/EmployeeController");

router.get("/", getEmployees);
router.get("/summary/departments", getDepartmentSummary);
router.get("/:id", getEmployeeById);
router.post("/", addEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.patch("/:id/toggle-active", toggleActive);

module.exports = router;
