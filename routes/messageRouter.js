import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'
import { createMessage } from '../controllers/messageController.js';


const messageRouter = express.Router();

messageRouter.post('/create-message', authMiddleware, createMessage);


export default messageRouter;






