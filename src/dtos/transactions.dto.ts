import { z } from "zod";
import { TransactionType } from "../entities/transactions.entity";

export const createTransactionsSchema = {
  title: z.string(),
  amount: z.number().int().positive(),
  type: z.nativeEnum(TransactionType),
  date: z.coerce.date(),
  categoryId: z.string().length(24),
};

const createTransactionObject = z.object(createTransactionsSchema);
export type CreateTransactionDTO = z.infer<typeof createTransactionObject>;
