import Role from "../models/Role.js";

// Create a new Role
export const createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Roles (optionally filter by context)
export const getRoles = async (req, res) => {
  try {
    const filter = {};

    // optional filters by query parameters
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.agencyId) filter["context.agencyId"] = req.query.agencyId;
    if (req.query.incidentId) filter["context.incidentId"] = req.query.incidentId;

    const roles = await Role.find(filter)
      .populate("userId")
      .populate("context.agencyId")
      .populate("context.incidentId");

    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single Role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate("userId")
      .populate("context.agencyId")
      .populate("context.incidentId");

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a Role
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a Role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
