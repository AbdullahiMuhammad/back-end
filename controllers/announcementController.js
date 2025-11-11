// controllers/announcementController.js
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import { io } from "../socket.js";

export const sendAnnouncement = async (req, res) => {
  const { title, message, level, zone, state } = req.body;
  const sender = req.user._id;

  let recipients = [];
  let scope = "individual";

  // Determine recipients by level
  if (level === "central") {
    recipients = await User.find({}, "_id");
    scope = "all";
  } else if (level === "zonal") {
    recipients = await User.find({ zone }, "_id");
    scope = "zone";
  } else if (level === "state") {
    recipients = await User.find({ state }, "_id");
    scope = "state";
  }

  if (!recipients.length)
    return res.status(404).json({ msg: "No users found for this announcement" });

  // Create notifications for all recipients
  const notifications = recipients.map((user) => ({
    recipient: user._id,
    scope,
    state,
    zone,
    type: "GENERAL_ANNOUNCEMENT",
    title,
    message,
    sender
  }));

  await Notification.insertMany(notifications);

  // Emit real-time to each connected user
  recipients.forEach((user) => {
    io.to(user._id.toString()).emit("new_notification", {
      type: "GENERAL_ANNOUNCEMENT",
      title,
      message,
      scope,
      state,
      zone
    });
  });

  res.json({ msg: "Announcement sent successfully", totalRecipients: recipients.length });
};
