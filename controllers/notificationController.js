// GET /notifications
import Notification from "../models/Notification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // assuming auth middleware
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
