// controllers/agencyController.js
import Agency from "../models/Agency.js";

// @desc    Create a new agency
// @route   POST /api/agencies
// @access  Private (admin/middleware handles auth)
export const createAgency = async (req, res) => {
  try {
    const { name, description, agencyType, jurisdiction, headquarters, primaryContact } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Agency name is required" });
    }

    const newAgency = await Agency.create({
      name,
      description,
      agencyType,
      jurisdiction,
      headquarters,
      primaryContact,
      active: true,
    });

    res.status(201).json({
      success: true,
      message: "Agency created successfully",
      data: newAgency,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all agencies
// @route   GET /api/agencies
// @access  Private
export const getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().populate("branches").populate("members");

    res.status(200).json({
      success: true,
      message: "Agencies retrieved successfully",
      data: agencies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single agency by ID
// @route   GET /api/agencies/:id
// @access  Private
export const getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id).populate("branches").populate("members");

    if (!agency) {
      return res.status(404).json({ success: false, message: "Agency not found" });
    }

    res.status(200).json({
      success: true,
      message: "Agency retrieved successfully",
      data: agency,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update agency
// @route   PUT /api/agencies/:id
// @access  Private (admin/middleware handles auth)
export const updateAgency = async (req, res) => {
  try {

    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({ success: false, message: "Agency not found" });
    }

    Object.assign(agency, req.body);
    await agency.save();

    res.status(200).json({
      success: true,
      message: "Agency updated successfully",
      data: agency,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete agency
// @route   DELETE /api/agencies/:id
// @access  Private (admin/middleware handles auth)
export const deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({ success: false, message: "Agency not found" });
    }

    await agency.remove();

    res.status(200).json({
      success: true,
      message: "Agency deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getAgencie = async () => {
  try {
    const agencies = await Agency.find({})
      .select('-_id -__v -createdAt -updatedAt')
      .populate({
        path: 'members',
        select: '-_id -__v -createdAt -updatedAt firstName lastName level role'
      })
      .populate({
        path: 'branches',
        select: '-_id -__v -createdAt -updatedAt name location'
      });

    return {
      success: true,
      data: agencies
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
};
