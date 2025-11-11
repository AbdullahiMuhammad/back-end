import UserRequest from "../models/UserRequest.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// Submit user request (registration)
export const submitUserRequest = async (req, res) => {
  try {
    const existingRequest = await UserRequest.findOne({ email: req.body.email });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: "You already submitted a request" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userRequest = new UserRequest({ ...req.body, password: hashedPassword });
    await userRequest.save();

    res.status(201).json({ success: true, data: userRequest, message: "Request submitted. Waiting for admin approval." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all pending requests (Admin)
export const getUserRequests = async (req, res) => {
  try {
    const requests = await UserRequest.find({ status: "pending" });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve request (Admin)
export const approveUserRequest = async (req, res) => {
  try {
    const request = await UserRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    // Create actual user
    const user = new User({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      password: request.password,
      address: request.address,
      state: request.state,
      zone: request.zone,
      localGovernment: request.localGovernment,
      roles: request.requestedRoles
    });
    await user.save();

    request.status = "approved";
    await request.save();

    // Optionally: send email to user
    await sendApprovalEmail(user.email, user.firstName);

    res.json({ success: true, data: user, message: "User request approved and account created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject request (Admin)
export const rejectUserRequest = async (req, res) => {
  try {
    const request = await UserRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.json({ success: true, message: "User request rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send email helper
const sendApprovalEmail = async (email, firstName) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Account Approved",
    text: `Hello ${firstName}, your account has been approved. You can now log in.`
  };

  await transporter.sendMail(mailOptions);
};
