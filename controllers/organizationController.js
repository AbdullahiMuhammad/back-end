import Organization from '../models/Organization.js';

// Create a new organization
export const createOrganization = async (req, res) => {
  try {
    const { type, fire_service_details, refinery_details, healthcare_details } = req.body;

    // Validate type-specific data
    if (type === 'Fire Service' && !fire_service_details) {
      return res.status(400).json({ message: 'Fire service details are required' });
    }
    if (type === 'Refinery' && !refinery_details) {
      return res.status(400).json({ message: 'Refinery details are required' });
    }
    if ((type === 'Hospital' || type === 'Laboratory') && !healthcare_details) {
      return res.status(400).json({ message: 'Healthcare details are required' });
    }

    const organization = new Organization(req.body);
    await organization.save();

    res.status(201).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating organization', error });
  }
};

// Get all organizations
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().populate('organization_users.user');
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizations', error });
  }
};

// Get organization by ID
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate('organization_users.user');
    if (!organization) return res.status(404).json({ message: 'Organization not found' });
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization', error });
  }
};

// Update organization
export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!organization) return res.status(404).json({ message: 'Organization not found' });
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization', error });
  }
};

// Delete organization
export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) return res.status(404).json({ message: 'Organization not found' });
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organization', error });
  }
};
