import { Product } from "../models/products.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadMultipleFiles,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import redis from "ioredis";

const redisPublisher = new redis();
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, images, itemType } =
    req.body;
  if (!name || !price || !category || !stock || !images || !itemType) {
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
    itemType,
    sellerId: userId,
  });
  const createdProduct = await product.save();

  redisPublisher.publish(
    `subCategory:${category}`,
    JSON.stringify({ productName: name, subCategoryId: category, price })
  );
  res
    .status(201)
    .json(new ApiResponse(200, product, "Product Created Successfully"));
});

const uploadProductImage = asyncHandler(async (req, res) => {
  const filePaths = req.files.map((file) => file.path);
  const response = await uploadMultipleFiles(filePaths);

  res.status(201).json(new ApiResponse(200, response));
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const {
    searchTerm,
    category,
    minPrice,
    maxPrice,
    itemType,
    sortBy,
    limit = 10,
    page = 1,
  } = req.body;

  const filters = {};
  if (searchTerm) {
    filters.name = { $regex: searchTerm, $options: "i" };
  }
  if (category) {
    filters.category = category;
  }
  if (minPrice) {
    filters.price = { ...filters.price, $gte: Number(minPrice) };
  }
  if (maxPrice) {
    filters.price = { ...filters.price, $lte: Number(maxPrice) };
  }
  if (itemType) {
    filters.itemType = itemType;
  }

  const skip = (page - 1) * limit;
  const sortOptions = {};
  if (sortBy === "price") {
    sortOptions.price = 1;
  } else if (sortBy === "latest") {
    sortOptions.createdAt = -1;
  }
  const products = await Product.find(filters)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));
  const itemCount = products.length;
  const totalCount = await Product.countDocuments(filters);

  return res.status(200).json(
    new ApiResponse(200, {
      products,
      pagination: {
        itemCount,
        totalCount,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  );
});

export { createProduct, uploadProductImage, getProductByCategory };
