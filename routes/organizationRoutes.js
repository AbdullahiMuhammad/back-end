import express from 'express';
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} from '../controllers/organizationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// CRUD Routes
router.post('/',authMiddleware, createOrganization);              // Create organization
router.get('/', authMiddleware, getAllOrganizations);               // Get all organizations
router.get('/:id', authMiddleware, getOrganizationById);         // Get single organization by ID
router.put('/:id', authMiddleware, updateOrganization);          // Update organization
router.delete('/:id', authMiddleware, deleteOrganization);       // Delete organization

export default router;
