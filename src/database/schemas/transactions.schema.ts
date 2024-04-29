import mongoose from "mongoose";
import { CategorySchema } from "./category.schema";


const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    title: String,
    amount: Number,
    type: String,
    date: Date,
    observation: {
      type: String, // Definindo o tipo como String
      default: "", // Definindo um valor padrão vazio
    },
    category: CategorySchema,
  },
  { versionKey: false }
);

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema
);
