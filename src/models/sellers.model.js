import mongoose, { Schema, model } from "mongoose";

const sellerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    storeName: {
      type: String,
      unique: true,
    },
    storeDescription: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Seller = model("Seller", sellerSchema);
