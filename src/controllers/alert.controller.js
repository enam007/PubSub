import { Subcriber } from "../models/subcriber.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAlert = asyncHandler(async (req, res) => {
  const { subCategoryId } = req.body;
  if (!subCategoryId) {
    throw new ApiError("400", "Category ID Reqd");
  }

  const existingAlert = await Subcriber.findOne({
    userId: req.user._id,
    subCategoryId,
  });
  if (existingAlert) {
    throw new ApiError(400, "You Already have an alert for this category");
  }
  const newAlert = new Subcriber({
    userId: req.user._id,
    email: req.user.email,
    subCategoryId,
  });
  await newAlert.save();
  return res
    .status(201)
    .json(new ApiResponse(200, {}, "New Alert Created Successfully"));
});

export { createAlert };
