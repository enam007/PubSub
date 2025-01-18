import { Router } from "express";
import {
  loginUser,
  verifyUserOtp,
  resendOtp,
  refreshAccessToken,
  logoutUser,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/login").post(loginUser);
authRouter.route("/verify-otp").post(verifyUserOtp);
authRouter.route("/resend-otp").post(resendOtp);
//secured routes
authRouter.route("/logout").post(authenticateUser, logoutUser);
authRouter.route("/refresh-token").post(refreshAccessToken);

export default authRouter;
