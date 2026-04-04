const express = require("express");
const router = express.Router();

const {
  getSummary,
  getCategoryData,
  getMonthlyTrends,
} = require("../controllers/dashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Summary is for Everyone (Viewers, Analysts, Admins)
router.get("/summary", protect, authorize("viewer", "analyst", "admin"), getSummary);

// Allocation Summary is for Everyone (including Viewers for basic dashboard)
router.get("/category", protect, authorize("viewer", "analyst", "admin"), getCategoryData);
router.get("/monthly", protect, authorize("analyst", "admin"), getMonthlyTrends);

module.exports = router;