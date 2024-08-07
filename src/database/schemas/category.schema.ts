import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema(
  {
    userId: String,
    title: String,
    Icon: String,
    color: String,
  },
  { versionKey: false }
);

export const CategoryModel = mongoose.model("Category", CategorySchema);

// ENTITY => SERVICE => CONTROLLER => ROUTE
