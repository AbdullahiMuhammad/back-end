
import Branch from '../models/Branch.js';
import IncidentAlerts from '../models/IncidentAlerts.js';
import { sendNotification, findBranchesAgents, getAgentEmails } from '../utils/notifier.js';


/**
 * Create a new incident and notify relevant branches.
 */
export const createIncident = async (req, res) => {
  try {
    // 1️⃣ Create the incident document
    const {state, localGov} = req.body;
    let notifiedBranches = [];
    
    const branch = await findBranchesAgents(state, localGov)
    branch.forEach(el => notifiedBranches.push(el._id));
    const emails = getAgentEmails(branch);

    await IncidentAlerts.create({ ...req.body, notifiedBranches });

    await  sendNotification(emails, "Test email", "Hello! This is a test.");
    res.status(201).json({
      success: true,
      message: "Incident reported"
    });
  } catch (err) {
    console.error('Error creating incident:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
