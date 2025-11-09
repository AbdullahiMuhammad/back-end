import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllUsers, getUser, updateDesignation, deleteUser, updateUserLocation, updateUserProfile,  } from '../controllers/userController.js';

const userRouter = express.Router();



userRouter.get("/get-logged-user", authMiddleware, getUser);
userRouter.get('/get-all-users', authMiddleware, getAllUsers)
userRouter.put("/:id", authMiddleware, updateDesignation);
userRouter.put("/:id", authMiddleware, updateUserLocation);
userRouter.put("/:id", authMiddleware, updateUserProfile);
userRouter.delete("/:id", authMiddleware, deleteUser);
export default userRouter;