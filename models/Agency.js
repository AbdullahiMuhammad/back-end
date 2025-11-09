import mongoose,  { Schema, Types } from "mongoose";


const AgencySchema = new Schema({
  name: { type: String, required: true }, // e.g. "Fire Service"
  description: { type: String },

  // Array of Branch references
  branches: [
    { type: Types.ObjectId, ref: "Branch" }
  ],

  // Contact information
  primaryContact: {
    name: { type: String },
    title: { type: String },
    email: { type: String },
    phone: { type: String }
  },

  // Location info (headquarters or central office)
  headquarters: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String }
  },

  // Agency type and jurisdiction
  agencyType: { type: String, enum: ["Fire", "Police", "Health", "Environmental", "Other"] },
  jurisdiction: { type: String }, // e.g., "City", "State", "Federal"

  // Operational info
  active: { type: Boolean, default: true },
  lastAuditDate: { type: Date },

  // 👇 Reference to members collection
  members: [
    { type: Types.ObjectId, ref: "User" }
  ],

}, { timestamps: true });

const Agency = mongoose.model("Agency", AgencySchema);
export default Agency;
