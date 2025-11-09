import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();

import connectDB from './db/db.js';
import authRoute from './routes/authRouter.js';
import userRouter from "./routes/userRouter.js";
import organizationRoutes from './routes/organizationRoutes.js';
import investigationRoutes from "./routes/investigationRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import incidentReportRoutes from './routes/incidentReportRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import incidentAlertRouter from "./routes/incidentAlertsRoutes.js";
import branchRouter from "./routes/branchRoutes.js";
import agencyRoutes from "./routes/agencyRoutes.js";

const app = express();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Serve React static files
app.use(express.static(path.join(__dirname, '../front-copy/dist')));

// Example API route

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRouter);
app.use('/api/organizations', organizationRoutes);
app.use("/api/investigations", investigationRoutes);
app.use("/api/roles", roleRoutes);
app.use('/api/reports', incidentReportRoutes);
app.use('/api/incident', incidentRoutes);
app.use('/api/agency', agencyRoutes);
app.use('/api/branch', branchRouter);
app.use('/api/incident-alerts', incidentAlertRouter);



// Catch-all route: use regex path
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../front-copy/dist', 'index.html'));
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
