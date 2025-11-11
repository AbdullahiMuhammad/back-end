import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  information: {
    type: String,
    required: true,
    trim: true
  },
  zone: {
    type: String,
    required: true,
    enum: [
      "North Central",
      "North East",
      "North West",
      "South East",
      "South South",
      "South West"
    ]
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  localGovernment: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  facilityType: {
    type: String,
    enum: ["Filling Station", "Depot", "Refinery", "Storage Tank", "Pipeline"],
    required: true
  },
  facilityName: {
    type: String,
    trim: true
  },
  reporterName: {
    type: String,
    required: true,
    trim: true
  },
  reporterEmail: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
  },
  reporterPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"]
  },
  attachments: [
    {
      fileUrl: String,
      fileType: String
    }
  ],
  
}, {timestamps: true});

export default mongoose.model("Report", reportSchema);
