const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const { authMiddleware, adminMiddleware } = require("../middleware");

const router = express.Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.post("/", authMiddleware, createUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
