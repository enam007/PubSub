import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  uploadProductImage,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = Router();

// protected routes
productRouter.route("/create").post(authenticateUser, createProduct);
productRouter
  .route("/upload-image")
  .post(authenticateUser, upload.array("images", 3), uploadProductImage);

export default productRouter;
