import express from 'express';
import * as appController from '../controllers/appController.js';

const router = express.Router();

// Routes for Agencies
router.get('/agencies', appController.getAllAgencies);                // Get all agencies
router.get('/agencies/:id', appController.getAgencyById);            // Get agency by ID
router.post('/agencies', appController.createAgency);                // Create a new agency

// Routes for Branches
router.post('/agencies/:agencyId/branches', appController.addBranchToAgency);  // Add a new branch to the agency

// Routes for Incidents
router.post('/agencies/:agencyId/incidents', appController.reportIncident);    // Report an incident

// Routes for Notifications
router.post('/agencies/:agencyId/notifications', appController.sendNotification); // Send a notification

export default router;
