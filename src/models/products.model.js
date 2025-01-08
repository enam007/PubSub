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
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: function () {
        return this.stock > 0;
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
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
