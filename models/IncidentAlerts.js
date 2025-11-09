import mongoose from 'mongoose';

const IncidentAlertSchema = new mongoose.Schema({
  fileRef: [{String}],
  description: String,
  state: String,
  localGov: String,
  adreess: String,
  notifiedBranches: [{ type: mongoose.Schema.ObjectId, ref: 'Branch' }]
}, { timestamps: true });

const IncidentAlerts = mongoose.model('Incidentalert', IncidentAlertSchema);

export default IncidentAlerts;
