const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/analyst", protect, authorize("analyst", "admin"), (req, res) => {
  res.json({ message: "Welcome Analyst/Admin" });
});

router.get("/viewer", protect, authorize("viewer", "analyst", "admin"), (req, res) => {
  res.json({ message: "Welcome Everyone" });
});

module.exports = router;