import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, default: "incident" }, // could be "incident", "system", etc.
    message: { type: String, required: true },
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report" }, // optional link
    read: { type: Boolean, default: false }, // mark as read when user views
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
