import mongoose from "mongoose";


export const GoalTrackingSchema = new mongoose.Schema(
    {
      userId:  String,
      name: String,
      currentAmount: Number,
      targetAmount:  Number,
      deadline: Date,
    },
    { timestamps: true, versionKey: false }
  );
  
  export const GoalTrackingModel = mongoose.model("GoalTracking", GoalTrackingSchema);
  
