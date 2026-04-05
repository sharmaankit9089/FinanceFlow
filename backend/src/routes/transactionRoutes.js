const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Create (only admin)
router.post("/", protect, authorize("admin"), createTransaction);

// Get Records (restricted to analyst and admin per new spec)
router.get("/", protect, authorize("analyst", "admin"), getTransactions);

// Update (admin only)
router.put("/:id", protect, authorize("admin"), updateTransaction);

// Delete (admin only)
router.delete("/:id", protect, authorize("admin"), deleteTransaction);

module.exports = router;