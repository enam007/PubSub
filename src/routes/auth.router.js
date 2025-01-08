import { Router } from "express";
import {
  loginUser,
  verifyUserOtp,
  resendOtp,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/login").post(loginUser);
authRouter.route("/verify-otp").post(verifyUserOtp);
authRouter.route("/resend-otp").post(resendOtp);

export default authRouter;
