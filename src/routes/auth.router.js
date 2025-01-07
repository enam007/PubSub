import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/login").post(loginUser);

export default authRouter;
