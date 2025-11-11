import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllUsers, getUser, updateLevel, deleteUser,  } from '../controllers/userController.js';

const userRouter = express.Router();



userRouter.get("/get-logged-user", authMiddleware, getUser);
userRouter.get('/get-all-users', authMiddleware, getAllUsers)
userRouter.put("/level:id", authMiddleware, updateLevel);
userRouter.delete("/:id", authMiddleware, deleteUser);
export default userRouter;