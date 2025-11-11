

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // in bytes
      required: true,
    },
    url: {
      type: String, // path or S3 URL
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedTo: {
      type: String, // optional: link to incident, report, etc.
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // auto-adds createdAt and updatedAt
);

export default mongoose.model("File", fileSchema);
