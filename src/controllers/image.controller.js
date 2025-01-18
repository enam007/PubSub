import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const uploadImage = asyncHandler(async (req, res) => {
  const filePaths = req.file.path;
  const { url, publicId } = await uploadOnCloudinary(filePaths);

  res.status(201).json(
    new ApiResponse(200, {
      url,
      publicId,
    })
  );
});

const deleteImage = asyncHandler(async (req, res) => {
  const publicId = req.query.publicId;
  const response = await deleteFromCloudinary(publicId);
  if (!response) {
    throw new ApiError(500, "Something Went Wrong while Deleting image");
  }
  res.status(201).json(new ApiResponse(200));
});

export { uploadImage, deleteImage };
