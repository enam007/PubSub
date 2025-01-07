import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
    },
    stocks: {
      type: Number,
    },
    category: {
      type: String,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model("Product", productSchema);
