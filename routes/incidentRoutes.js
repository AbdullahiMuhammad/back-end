import express from "express";
import Incident from "../models/Incident.js";
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


// Add a new briefing note
router.post("/:incidentId/briefings", authMiddleware, async (req, res) => {
  const { incidentId } = req.params;
  const { message } = req.body;

  if (!message) return res.status(400).json({ success: false, message: "Message required" });

  try {
    const incident = await Incident.findById(incidentId);
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });

    incident.briefings.push({
      userId: req.user._id,
      userName: req.user.email,
      message,
    });

    await incident.save();
    res.json({ success: true, data: incident.briefings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all briefings for an incident
router.get("/:incidentId/briefings", authMiddleware, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.incidentId).populate("briefings.userId", "name");
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });

    res.json({ success: true, data: incident.briefings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add a new briefing note
router.post("/:incidentId/repoting", authMiddleware, async (req, res) => {
  const { incidentId } = req.params;
  const { message } = req.body;

  if (!message) return res.status(400).json({ success: false, message: "Message required" });

  try {
    const incident = await Incident.findById(incidentId);
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });

    incident.briefings.push({
      userId: req.user._id,
      userName: req.user.name,
      message,
    });

    await incident.save();
    res.json({ success: true, data: incident.briefings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all briefings for an incident
router.get("/:incidentId/reporting", authMiddleware, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.incidentId).populate("briefings.userId", "name");
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });

    res.json({ success: true, data: incident.briefings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }})

export default router;
