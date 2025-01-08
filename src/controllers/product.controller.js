import { Product } from "../models/products.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadMultipleFiles,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;
  if (!name || !price || !category || !stock || !images) {
    throw new ApiError(400, "Please provide all reqd Fields");
  }

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    images,
    sellerId: userId,
  });
  const createdProduct = await product.save();
  if (!user.isSeller) {
    user.isSeller = true;
    await user.save();
  }
  res
    .status(201)
    .json(new ApiResponse(200, product, "Product Created Successfully"));
});

const uploadProductImage = asyncHandler(async (req, res) => {
  const filePaths = req.files.map((file) => file.path);
  const response = await uploadMultipleFiles(filePaths);

  res.status(201).json(new ApiResponse(200, response));
});

export { createProduct, uploadProductImage };
