import express from "express";
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
} from "../controllers/reportController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes
router.get("/", authMiddleware, getAllReports);          // Get all reports
router.get("/:id", authMiddleware,getReportById);      // Get report by ID
router.post("/", createReport);         // Create new report
router.put("/:id", authMiddleware, updateReport);       // Update report
router.delete("/:id", authMiddleware, deleteReport);    // Delete report

export default router;
