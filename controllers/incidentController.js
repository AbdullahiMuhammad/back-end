import mongoose from "mongoose";
import Incident from "../models/Incident.js";

// --- Create Incident ---
export const createIncident = async (req, res) => {
  try {
    const { members = [], ...rest } = req.body;

    const newIncident = new Incident({
      ...rest,
      createdBy: req.user._id, // set by auth middleware
      members: members.map((m) => ({
        user:m.user,
        permission: m.permission || "view",
      })),
    });

    await newIncident.save();

    res.status(201).json({
      success: true,
      message: "Incident created successfully",
      incident: newIncident,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
// @desc    Get all incidents accessible to a user
// @route   GET /api/incidents
// @access  Private
export const getAllIncidents = async (req, res) => {
  try {
    const user = req.user; // decoded from JWT middleware
    const userId = user._id;

    let filter = {};

    // 🟢 CENTRAL — sees everything
    if (user.level === "central") {
      const incidents = await Incident.find({})
        .populate("createdBy", "name email role")
        .populate("members.user", "name email role")
        .populate("reports");

      return res.status(200).json({
        success: true,
        level: user.level,
        count: incidents.length,
        data: incidents,
      });
    }

    // 🟡 ZONAL — only incidents within the same zone
    if (user.level === "zonal") {
      filter["location.zone"] = user.zone;
    }

    // 🟠 STATE — only incidents within the same state
    if (user.level === "state") {
      filter["location.state"] = user.state;
    }

    // 🔵 AGENT (or anyone else without zone/state-level access)
    // Can only see incidents they created or where they're a member
    if (user.role === "agent") {
      filter = {
        $or: [{ createdBy: userId }, { "members.user": userId }],
      };
    }

    const incidents = await Incident.find(filter)
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role")
      .populate("reports");

    res.status(200).json({
      success: true,
      level: user.level,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch incidents",
    });
  }
};

// --- Get Single Incident ---
export const getIncident = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid incident ID" });
    }

    const incident = await Incident.findById(id).populate("members.user", "name email");

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    res.status(200).json({ success: true, incident });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// --- Update Incident ---
export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid incident ID" });
    }

    // Extract only the fields allowed to be updated
    const {
      severity,
      affectedPopulation,
      casualties,
      resources,
      summaryResponse,
      witnesses,
    } = req.body;

    // Build the update object dynamically (only include provided fields)
    const updateFields = {};
    if (severity !== undefined) updateFields.severity = severity;
    if (affectedPopulation !== undefined) updateFields.affectedPopulation = affectedPopulation;
    if (casualties !== undefined) updateFields.casualties = casualties;
    if (resources !== undefined) updateFields.resources = resources;
    if (summaryResponse !== undefined) updateFields.summaryResponse = summaryResponse;
    if (witnesses !== undefined) updateFields.witnesses = witnesses;

    // Update the document
    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("members.user", "name email");

    // Handle not found
    if (!updatedIncident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Incident updated successfully",
      incident: updatedIncident,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// --- Get All Incidents ---
export const getAllIncident = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("members.user", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({ success: true, incidents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
