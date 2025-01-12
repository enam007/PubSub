import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  getCategory,
  addCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.route("/list").get(authenticateUser, getCategory);
categoryRouter.route("/add-category").post(authenticateUser, addCategory);
export default categoryRouter;
