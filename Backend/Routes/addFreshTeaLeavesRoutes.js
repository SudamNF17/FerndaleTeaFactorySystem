const express = require("express");
const router = express.Router();
const controller = require("../Controllers/addFreshTeaLeavesController");

router.get("/", controller.getAllLeaves);
router.post("/", controller.createLeaves);
router.put("/:id", controller.updateLeaves);
router.delete("/:id", controller.deleteLeaves);

module.exports = router;
