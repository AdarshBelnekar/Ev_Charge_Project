import express from "express";
import { loginUser,registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// login routes
userRouter.post("/login", loginUser);

// Registeer route
userRouter.post("/register", registerUser);




export default userRouter;