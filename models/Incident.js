import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  // Basic Info
  title: { type: String, required: true },
  incidentType: {
    type: String,
    enum: ["Fire", "Explosion", "Oil Spill", "Gas Leak", "Vandalism", "Equipment Failure", "Other"],
    required: true,
  },
  description: { type: String, required: true },
  dateOfIncident: { type: Date, required: true },
  timeOfIncident: { type: String },
  facilityType: {
    type: String,
    enum: ["Depot", "Pipeline", "Filling Station", "Refinery", "Vessel", "Storage Tank", "Transport Vehicle", "Other"],
  },
  state: { type: String, required: true },
  lga: { type: String },
  address: { type: String },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  zone: { type: String },
  status: {
    type: String,
    enum: ["Pending", "In Review", "Resolved", "Closed"],
    default: "Pending",
  },

  // Briefing
  cause: { type: String },
  immediateActionsTaken: { type: String },
  injured: { type: Number, default: 0 },
  fatalities: { type: Number, default: 0 },
  environmentalImpact: { type: String },
  regulatoryBodiesNotified: [{ type: String }], // e.g., "NEMA", "NOSDRA"
  mediaCoverage: { type: Boolean, default: false },
  photos: [{ type: String }], // URLs or file references

  // Reporting
  investigationFindings: { type: String },
  rootCauseAnalysis: { type: String },
  correctiveActions: { type: String },
  preventiveActions: { type: String },
  followUpStatus: {
    type: String,
    enum: ["Not Started", "Ongoing", "Completed"],
    default: "Not Started",
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dateVerified: { type: Date },

  // Members
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String }, // e.g., "Inspector", "State Coordinator"
      canEdit: { type: Boolean, default: false },
      canView: { type: Boolean, default: true },
    },
  ],
  briefings: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String }, // optional but useful
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },],
    reporting: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String }, // optional but useful
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },],

  // Settings
  confidentiality: {
    type: String,
    enum: ["Public", "Restricted", "Confidential"],
    default: "Restricted",
  },
  assignedInspectors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notificationsEnabled: { type: Boolean, default: true },

  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Incident", incidentSchema);
