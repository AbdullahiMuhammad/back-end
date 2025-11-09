import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import { createChat, getUserChat } from '../controllers/chatController.js';


const chatRouter = express.Router();

chatRouter.post("/create-chat", authMiddleware, createChat);
chatRouter.get("/get-user-chat", authMiddleware, getUserChat);


export default chatRouter;