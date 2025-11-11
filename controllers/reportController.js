import Report from "../models/Report.js";
import Agency from "../models/Agency.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1});
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new report
export const createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json({ success: true, message: "Report created successfully", data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update a report by ID
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, message: "Report updated successfully", data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete a report by ID
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




export const createReports = async (req, res) => {
  try {
    // 1️⃣ Save report
    const report = new Report(req.body);
    await report.save();

    const { zone, state, localGovernment } = req.body.info || req.body;
    if (!zone || !state || !localGovernment) {
      return res.status(400).json({ success: false, message: "Missing location info" });
    }

    // 2️⃣ Find agencies with branches in the same location
    const agencies = await Agency.find({
      $or: [
        { "branches.zone": zone, "branches.state": state, "branches.localGovernment": localGovernment },
        { "branches.state": state, "branches.localGovernment": localGovernment },
        { "branches.localGovernment": localGovernment },
      ],
    });

    // 3️⃣ Collect all emails: HQ + matching branches
    let emailRecipients = [];
    agencies.forEach((agency) => {
      emailRecipients.push(agency.email); // HQ
      agency.branches.forEach((branch) => {
        if (
          (branch.zone === zone && branch.state === state && branch.localGovernment === localGovernment) ||
          (branch.state === state && branch.localGovernment === localGovernment) ||
          (branch.localGovernment === localGovernment)
        ) {
          emailRecipients.push(branch.email);
        }
      });
    });

    // 4️⃣ Send emails
    if (emailRecipients.length > 0) {
      await transporter.sendMail({
        from: `"Incident Alert" <${process.env.MAIL_USER}>`,
        to: emailRecipients.join(","),
        subject: `⚠️ New Incident in ${localGovernment}, ${state}`,
        html: `<h3>Incident Alert</h3>
               <p>Title: ${report.info?.title}</p>
               <p>Type: ${report.info?.incidentType}</p>
               <p>Location: ${localGovernment}, ${state} (${zone})</p>
               <p><a href="${process.env.FRONTEND_URL}/reports/${report._id}">View Report</a></p>`,
      });
    }

    // 5️⃣ Create manual notifications for users levels 1–3
    const targetUsers = await User.find({
      level: { $in: [1, 2, 3] },
      $or: [
        { zone, state, localGovernment },
        { state, localGovernment },
        { localGovernment },
      ],
    });

    const notifications = targetUsers.map((u) => ({
      user: u._id,
      message: `New incident reported in ${localGovernment}, ${state}: ${report.info?.title}`,
      report: report._id,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Report created. ${emailRecipients.length} agency emails sent, ${notifications.length} user notifications created.`,
      data: report,
    });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};