import Branch from '../models/Branch.js';

/**
 * @desc    Get all branches
 * @route   GET /api/branches
 */
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate('agency');
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get a single branch by ID
 * @route   GET /api/branches/:id
 */
export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate('agency');
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new branch
 * @route   POST /api/branches
 */
export const createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    const savedBranch = await branch.save();
    res.status(201).json(savedBranch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update a branch
 * @route   PUT /api/branches/:id
 */
export const updateBranch = async (req, res) => {
  try {
    const updated = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete a branch
 * @route   DELETE /api/branches/:id
 */
export const deleteBranch = async (req, res) => {
  try {
    const deleted = await Branch.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
