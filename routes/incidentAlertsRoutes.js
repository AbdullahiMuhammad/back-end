import express from 'express';
import { createIncident } from '../controllers/incidentAlertsController.js';

const incidentAlertRouter = express.Router();

// POST /incidents
incidentAlertRouter.post('/', createIncident);

export default incidentAlertRouter;
