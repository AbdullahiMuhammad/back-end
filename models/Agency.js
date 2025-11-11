import mongoose from 'mongoose';

// Define the schema for the agency (with nested branches and notifications)
const agencySchema = new mongoose.Schema({
  agency_id: { type: String, required: true },
  agency_name: { type: String, required: true },
  agency_type: { type: String, required: true },
  contact_email: { type: String, required: true },
  contact_phone: { type: String, required: true },
  contact_address: { type: String, required: true },
  nmdpra_registration_number: { type: String, required: true },
  nmdpra_sector: { type: String, required: true },
  nmdpra_operational_area: { type: String, required: true },

  // Branches array inside the agency schema
  branches: [
    {
      branch_id: { type: String, required: true },
      branch_name: { type: String, required: true },
      zone: { type: String, required: true },
      state: { type: String, required: true },
      local_government: { type: String, required: true },
      address: { type: String, required: true },
      contact_email: { type: String, required: true },
      contact_phone: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  ],

  // Notifications array inside the agency schema
  notifications: [
    {
      incident_id: { type: String, required: true },
      branch_id: { type: String, required: true },
      notification_time: { type: Date, default: Date.now },
      notification_type: { type: String, default: 'Email' }, // Email, SMS, etc.
      notification_status: { type: String, default: 'Sent' }, // Sent, Pending, etc.
    },
  ],
});

export default mongoose.model('Agency', agencySchema);
