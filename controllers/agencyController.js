import Agency from '../models/appModel.js';

// Get all agencies
export const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.status(200).json(agencies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agencies', error: err });
  }
};

// Get an agency by ID
export const getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    res.status(200).json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agency', error: err });
  }
};

// Create a new agency
export const createAgency = async (req, res) => {
  try {
    const newAgency = new Agency(req.body);
    await newAgency.save();
    res.status(201).json(newAgency);
  } catch (err) {
    res.status(500).json({ message: 'Error creating agency', error: err });
  }
};

// Add a new branch to an agency
export const addBranchToAgency = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.agencyId);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    agency.branches.push(req.body); // Add new branch to the agency's branches array
    await agency.save();
    res.status(201).json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Error adding branch', error: err });
  }
};

// Report an incident and send notification
export const reportIncident = async (req, res) => {
  try {
    const { incident_id, branch_id, description, incident_time, latitude, longitude } = req.body;
    
    // Create the incident object
    const incident = {
      incident_id,
      branch_id,
      description,
      incident_time,
      location: { latitude, longitude }
    };

    // Find the agency by ID
    const agency = await Agency.findById(req.params.agencyId);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    // Create and push notification to the agency's notifications array
    const notification = {
      incident_id: incident.incident_id,
      branch_id: incident.branch_id,
      notification_status: 'Pending',  // Default status
    };

    agency.notifications.push(notification);  // Add notification to agency
    await agency.save();
    
    res.status(201).json({ message: 'Incident reported and notification created', incident });
  } catch (err) {
    res.status(500).json({ message: 'Error reporting incident', error: err });
  }
};

// Send a notification
export const sendNotification = async (req, res) => {
  try {
    const notification = {
      incident_id: req.body.incident_id,
      branch_id: req.body.branch_id,
      notification_type: req.body.notification_type,
      notification_status: 'Sent', // Assuming we are sending the notification
    };

    const agency = await Agency.findById(req.params.agencyId);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    agency.notifications.push(notification);  // Add notification to the agency's notifications array
    await agency.save();
    
    res.status(201).json({ message: 'Notification sent', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error sending notification', error: err });
  }
};
