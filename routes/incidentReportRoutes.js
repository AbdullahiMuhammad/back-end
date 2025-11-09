import express from 'express';
import {
  createIncidentReport,
  getAllIncidentReports,
  getIncidentReportById,
  updateIncidentReport
} from '../controllers/incidentReportController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

// Create a new report
router.post('/', authMiddleware, createIncidentReport);

// Get all reports
router.get('/', authMiddleware, getAllIncidentReports);

// Get single report by ID
router.get('/:id', authMiddleware, getIncidentReportById);

// Update report (status, reviewers, etc.)
router.put('/:id',authMiddleware,  updateIncidentReport);

export default router;
