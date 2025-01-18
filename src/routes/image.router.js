import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { deleteImage, uploadImage } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const imageRouter = Router();

imageRouter
  .route("/upload-image")
  .post(authenticateUser, upload.single("image"), uploadImage);
imageRouter.route("/delete-image").delete(authenticateUser, deleteImage);

export default imageRouter;
