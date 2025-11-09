import mongoose from "mongoose";

const { Schema, model } = mongoose;

const incidentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    state: {
      type: String,
      required: true,
    },
     localGov: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Resolved", "Closed"],
      default: "New",
    },
    summary: {
      type: String, // manager/admin can fill after reviewing reports
    },
    affectedPopulation: {
      type: Number,
      default: 0,
    },
    casualties: {
      type: Number,
      default: 0,
    },
    resources: {
      type: String,
    },
    witnesses: {
      type: Number,
      default: 0,
    },
    summaryResponse: {
      type: String,
    },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "IncidentReport" }],

    // --- User management fields ---
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Members who can upload or view reports
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        permission: {
          type: String,
          enum: ["view", "upload", "admin"], // upload = can submit reports
          default: "view",
        },
      },
    ],
  },
  {
    timestamps: {require: true, select: false},
    
  }
);

const Incident = model("incident", incidentSchema);

export default Incident;
