import { Router } from "express";
import { createAlert } from "../controllers/alert.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const alertRouter = Router();

alertRouter.route("/create-alert").post(authenticateUser, createAlert);

export default alertRouter;
