import express from "express";
import {
  createIncident,
  getAllIncidents,
 // getIncidentById,
  updateIncident,
 // addReportToIncident,
} from "../controllers/incidentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new incident
router.post("/", authMiddleware, createIncident);

// Get all incidents
router.get("/", authMiddleware, getAllIncidents);

// Get a single incident by ID
//router.get("/:id", authMiddleware, getIncidentById);

// Update incident (status, summary, etc.)
 router.put("/:id",authMiddleware, updateIncident);

// Add a report to an incident
//router.post("/:incidentId/reports", authMiddleware, addReportToIncident);

export default router;
