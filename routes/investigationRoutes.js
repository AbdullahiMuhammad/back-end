import express from "express";
import {
  createInvestigation,
  getInvestigations,
  getInvestigationById,
  updateInvestigation,
  deleteInvestigation
} from "../controllers/investigationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// CRUD Routes
router.post("/", authMiddleware, createInvestigation);
router.get("/", authMiddleware, getInvestigations);
router.get("/:id", authMiddleware, getInvestigationById);
router.put("/:id",authMiddleware, updateInvestigation);
router.delete("/:id", authMiddleware, deleteInvestigation);

export default router;
