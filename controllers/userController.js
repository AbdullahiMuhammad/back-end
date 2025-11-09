import User from "../models/User.js";



export const getUser = async (req, res) => {
  try {
    const userId = req.body.userId; // get ID from URL

    const user = await User.findById(userId)
      .populate("organization", "name")
      .populate("branch", "name")
      .populate("roles", "name")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




export const getAllUsers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { designation, zone, state } = req.user;
    const filter = {};

    switch (designation) {
      case "zonal":
        filter.zone = zone;
        break;
      case "state":
        filter.state = state;
        break;
      // "admin" or other roles will see all users (no filter applied)
    }

    const users = await User.find(filter).select("-password -token");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation: loggedRole } = req.user;
    const { newDesignation } = req.body;

    if (!newDesignation) {
      return res.status(400).json({ message: "New designation is required" });
    }

    // Role-based restriction: zonal users cannot assign higher roles
    if (loggedRole === "zonal" && ["zonal", "central"].includes(newDesignation)) {
      return res.status(403).json({ message: "Cannot assign higher roles" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { designation: newDesignation },
      { new: true, runValidators: true }
    ).select("-password -token");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Designation updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating designation:", error);
    res.status(500).json({ message: "Failed to update designation" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { designation } = req.user;
    const { id } = req.params;

    // Authorization check
    if (designation !== "central") {
      return res.status(403).json({ message: "Only central users can delete accounts" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const allowedFields = ["email", "phone", "address"]; // Only editable fields

    // Pick only allowed fields from req.body
    const updates = Object.keys(req.body)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -token");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { designation } = req.user;
    const { id } = req.params;
    const { zone, state, localGovernment } = req.body;

    // Only central users can update location data
    if (designation !== "central") {
      return res.status(403).json({ message: "Only central users can update user locations" });
    }

    // Validate at least one field
    if (!zone && !state && !localGovernment) {
      return res.status(400).json({ message: "At least one field (zone, state, or localGovernment) is required" });
    }

    // Build update object dynamically
    const updates = {};
    if (zone) updates.zone = zone;
    if (state) updates.state = state;
    if (localGovernment) updates.localGovernment = localGovernment;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -token");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User location updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ message: "Failed to update user location" });
  }
};
