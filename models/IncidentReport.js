import mongoose from 'mongoose';

const { Schema } = mongoose;

// Media Schema
const mediaSchema = new Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: String,
});

// Main Incident Report Schema
const incidentReportSchema = new Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  reporter: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    designation: String,
    branch: String,
    contact: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  location: { type: String, required: true },
  sampleIDs: [{ type: String, required: true }],
  reportBody: {
    description: { type: String, required: true },
    immediateActions: [String],
    impact: {
      affectedSamples: Number,
      severity: { type: String, enum: ['Low', 'Medium', 'High'] },
      consequence: String,
    },
    rootCause: String,
    preventiveMeasures: [String],
  },
  mediaAttachments: [mediaSchema],
  complianceFlag: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['New', 'Under Investigation', 'Closed'],
    default: 'New',
  },
  reviewers: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateReviewed: Date,
    notes: String,
  }],
}, {
  timestamps: true,
});

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);

export default IncidentReport;
