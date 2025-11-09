import IncidentReport from '../models/IncidentReport.js';
import { sendEmail,  } from '../utils/notificationService.js';

// Create a new incident report
export const createIncidentReport = async (req, res) => {
  try {
    const newReport = new IncidentReport(req.body);
    const savedReport = await newReport.save();

     // Notify agencies
    const agencies = await Agency.find();
    const message = `New Incident: ${incident.title}\n${incident.description}\nLocation: ${incident.location}\nSeverity: ${incident.severity}`;

    for (const agency of agencies) {
      // Email
      await sendEmail(agency.email, "New Incident Alert", message);
      // SMS
      
    }
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all incident reports
export const getAllIncidentReports = async (req, res) => {
  try {
    const reports = await IncidentReport.find()
      .populate('reporter.userId', 'name role designation')
      .populate('reviewers.user', 'name role designation')
      .sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single incident report by ID
export const getIncidentReportById = async (req, res) => {
  try {
    const report = await IncidentReport.findById(req.params.id)
      .populate('reporter.userId', 'name role designation')
      .populate('reviewers.user', 'name role designation');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update incident report status or add reviewer notes
export const updateIncidentReport = async (req, res) => {
  try {
    const report = await IncidentReport.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
