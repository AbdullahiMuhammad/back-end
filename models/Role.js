import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Admin"
  level: { type: Number, required: true }, // e.g., 5 = highest authority
  platformAccess: [String], // modules/features this role can access, e.g., ["Dashboard", "Reports", "Settings"]
  permissions: {
    viewInternalReportTabs: [String], // e.g., ["Info", "Briefing", "Tasks"]
    canCreateIncident: { type: Boolean, default: false },
    canAssignTask: { type: Boolean, default: false },
    canUpdateUser: { type: Boolean, default: false },
    canSuspendUser: { type: Boolean, default: false },
    canDeleteUser: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.model("Role", RoleSchema);
