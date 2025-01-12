import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getCategory = asyncHandler(async (req, res) => {
  const { parentCategory } = req.body;

  const categories = await Category.find(
    parentCategory ? { parentCategory } : { parentCategory: null }
  ).select("-description -createdAt -updatedAt -createdBy");

  return res.status(200).json(new ApiResponse(200, categories));
});

const addCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory, image } = req.body;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(400, "Category with this name already exist");
  }
  const category = new Category({
    name,
    description,
    image,
    parentCategory: parentCategory || null,
    createdBy: req.user._id,
  });
  const addedCategory = await category.save();
  return res
    .status(201)
    .json(new ApiResponse(201, addedCategory, "Category Added Successfully"));
});

export { getCategory, addCategory };
