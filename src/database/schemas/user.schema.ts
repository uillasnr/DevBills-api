import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { versionKey: false }
);

export const UserModel = mongoose.model("User", UserSchema);

// ENTITY => SERVICE => CONTROLLER => ROUTE
