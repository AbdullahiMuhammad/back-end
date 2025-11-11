import express from "express";
import {
  submitUserRequest,
  getUserRequests,
  approveUserRequest,
  rejectUserRequest
} from "../controllers/userRequestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// User submits request
router.post("/", submitUserRequest);

// Admin: view all pending requests
router.get("/", authMiddleware, getUserRequests);

// Admin: approve or reject request
router.patch("/approve/:id", authMiddleware, approveUserRequest);
router.patch("/reject/:id", authMiddleware, rejectUserRequest);

export default router;
