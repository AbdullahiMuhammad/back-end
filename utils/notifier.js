import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Branch from '../models/Branch.js';





dotenv.config();

// --- Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Optional: verify transporter
transporter.verify((err, success) => {
  if (err) console.error("SMTP transporter error:", err);
  else console.log("SMTP transporter ready");
});





export async function findBranchesAgents(state, localGov) {
  // Find branches that match the incident location
  const branches = await Branch.find({ state, localGov }).exec();
  return branches;
}


export function getAgentEmails(branches) {
  const emails = [];
  
  branches.forEach(branch => {
    // Add agent emails only
    if (Array.isArray(branch.agents)) {
      branch.agents.forEach(agent => {
        if (agent.email) emails.push(agent.email);
      });
    }
  });

  // Remove duplicates
  return [...new Set(emails)];
}
// --- Send Notification Function ---
export async function sendNotification(to, subject, text) {
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, info };
  } catch (err) {
    console.error("SMTP send error:", err);
    return { success: false, error: err };
  }
}
