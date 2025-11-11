import User from "../models/User.js";

// Get single user
export const getUser = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId).select("-password -token");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all users with level-based filtering
export const getAllUsers = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { level: loggedLevel, zone, state } = req.user;
    const filter = {};

    // Apply filtering based on user level
    if (loggedLevel === 3) filter.zone = zone; // Zonal can see their zone
    else if (loggedLevel === 2) filter.state = state; // State can see their state
    // Admin (level 4) sees all, Inspector (level 1) may have no access

    const users = await User.find(filter).select("-password -token");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Update user level
export const updateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { level: loggedLevel } = req.user;
    const { newLevel } = req.body;

    if (!newLevel) return res.status(400).json({ message: "New level is required" });

    // Permission check: zonal (3) cannot assign higher roles (3 or 4)
    if (loggedLevel === 3 && newLevel >= 3) {
      return res.status(403).json({ message: "Cannot assign higher roles" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { level: newLevel },
      { new: true, runValidators: true }
    ).select("-password -token");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Level updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating level:", error);
    res.status(500).json({ message: "Failed to update level" });
  }
};

// Delete user (only admin)
export const deleteUser = async (req, res) => {
  try {
    const { level: loggedLevel } = req.user;
    const { id } = req.params;

    if (loggedLevel !== 4) return res.status(403).json({ message: "Only Admin can delete users" });

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
