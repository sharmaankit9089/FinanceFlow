const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes here are admin only
router.use(protect, authorize("admin"));

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
