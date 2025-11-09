// routes/agencyRoutes.js
import express from "express";
import {
  createAgency,
  getAgencies,
  getAgencyById,
  updateAgency,
  deleteAgency
} from "../controllers/agencyController.js";

const router = express.Router();

// Routes
router.post("/", createAgency);           // Create new agency
router.get("/", getAgencies);            // Get all agencies
router.get("/:id", getAgencyById);       // Get single agency by ID
router.put("/:id", updateAgency);        // Update agency
router.delete("/:id", deleteAgency);     // Delete agency

export default router;
