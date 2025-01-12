import { Schema, model } from "mongoose";

const subcriberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subcriber = model("Subcriber", subcriberSchema);
