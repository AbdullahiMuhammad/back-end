import Investigation from "../models/Investigation.js";

// Create a new Investigation
export const createInvestigation = async (req, res) => {
  try {
    const investigation = new Investigation(req.body);
    await investigation.save();
    res.status(201).json({success: true, data: investigation});
  } catch (error) {
    res.status(400).json({success: false, message: error.message });
  }
};

// Get all Investigations
export const getInvestigations = async (req, res) => {
  try {
    const investigations = await Investigation.find()
      .populate("incident")
      .populate("investigator");
    res.status(200).json({success: true, data: investigations});
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
};

// Get a single Investigation by ID
export const getInvestigationById = async (req, res) => {
  try {
    const investigation = await Investigation.findById(req.params.id)
      .populate("incident")
      .populate("investigator");

    if (!investigation) {
      return res.status(404).json({success: false, message: "Investigation not found" });
    }

    res.status(200).json({success: false, data: investigation});
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
};

// Update an Investigation
export const updateInvestigation = async (req, res) => {
  try {
    const investigation = await Investigation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!investigation) {
      return res.status(404).json({success: false, message: "Investigation not found" });
    }

    res.status(200).json({ success: false, data: investigation});
  } catch (error) {
    res.status(400).json({success: false, message: error.message });
  }
};

// Delete an Investigation
export const deleteInvestigation = async (req, res) => {
  try {
    const investigation = await Investigation.findByIdAndDelete(req.params.id);

    if (!investigation) {
      return res.status(404).json({success: false, message: "Investigation not found" });
    }

    res.status(200).json({success: true, message: "Investigation deleted successfully" });
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
};
