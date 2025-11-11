import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getUserNotifications } from '../controllers/notificationController.js';

const notifyRoute = express.Router();



notifyRoute.get("/", authMiddleware, getUserNotifications);

export default notifyRoute;