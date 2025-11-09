const nodemailer = require('nodemailer');
const Branch = require('../models/Branch');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

/**
 * Find branches to notify based on incident state/localGov (or nearby)
 */
async function findBranchesForIncident(incident) {
  const query = { state: incident.state };
  if (incident.localGov) query.localGov = incident.localGov;

  // match by state/localGov
  let branches = await Branch.find(query).populate('agency').exec();

  // optional: fallback to nearest branch if coordinates exist
  if (branches.length === 0 && incident.location?.coordinates?.length === 2) {
    branches = await Branch.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: incident.location.coordinates },
          $maxDistance: 15000 // 15 km radius
        }
      }
    }).populate('agency').exec();
  }

  return branches;
}

/**
 * Send email alert to branch + its agents
 */
async function notifyBranches(incident, branches) {
  const mails = [];

  for (const branch of branches) {
    const recipients = [branch.email, ...branch.agents.map(a => a.email).filter(Boolean)];
    const subject = `[ALERT] New Incident in ${incident.state} - ${incident.localGov}`;
    const text = `
Incident Report:
Description: ${incident.description}
File: ${incident.fileRef || 'None'}
Location: ${incident.state}, ${incident.localGov}
Coordinates: ${incident.location?.coordinates?.join(', ') || 'N/A'}

Please respond immediately.

-- ${branch.agency?.name || 'Incident Portal'}
`;

    for (const to of recipients) {
      mails.push(
        transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to,
          subject,
          text
        }).then(() => ({ ok: true, to })).catch(err => ({ ok: false, err, to }))
      );
    }
  }

  const results = await Promise.all(mails);
  const sent = results.filter(r => r.ok).length;

  return { sent, results };
}

module.exports = { findBranchesForIncident, notifyBranches };
