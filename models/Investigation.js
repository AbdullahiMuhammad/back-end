import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

// Witness Schema
const WitnessSchema = new Schema({
  name: { type: String, default: "Unnamed Witness" },
  statement: { type: String, required: true }
});

// Main Investigation Schema
const InvestigationSchema = new Schema(
  {
    investigationId: { type: String, required: true, unique: true },
    incident: { type: Types.ObjectId, ref: "Incident", required: true }, // Reference to Incident
    investigator: { type: Types.ObjectId, ref: "User", required: true }, // Reference to investigator/admin
    dateTime: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ["Open", "In Progress", "Closed", "Pending"], 
      default: "Open" 
    },
    findings: { type: String, default: "" },
    cause: { type: String, default: "" },
    impact: { type: String, default: "" },
    actions: { type: String, default: "" },
    recommendations: { type: String, default: "" },
    witnesses: [WitnessSchema],
    reviewerComments: { type: String, default: "" }
  },
  { timestamps: true }
);

export default model("Investigation", InvestigationSchema);
