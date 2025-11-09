import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole
} from "../controllers/roleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// CRUD routes
router.post("/", authMiddleware, createRole);         // Create a role
router.get("/", authMiddleware, getRoles);            // Get all roles, can filter by query params
router.get("/:id",authMiddleware, getRoleById);      // Get role by ID
router.put("/:id",authMiddleware, updateRole);       // Update role
router.delete("/:id",authMiddleware, deleteRole);    // Delete role

export default router;
