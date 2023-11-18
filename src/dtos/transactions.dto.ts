import { z } from "zod";
import { TransactionType } from "../entities/transactions.entity";

// Definindo o esquema para a criação de transações
export const createTransactionsSchema = {
  title: z.string(),
  amount: z.number().int().positive(),
  type: z.nativeEnum(TransactionType),
  date: z.coerce.date(),
  categoryId: z.string().length(24),
};

// Criando o objeto de transação utilizando o esquema definido acima
const createTransactionObject = z.object(createTransactionsSchema);
export type CreateTransactionDTO = z.infer<typeof createTransactionObject>;

// Definindo o esquema para os filtros na busca de transações
export const indexTransactionSchema = {
  title: z.string().optional(),
  categoryId: z.string().length(24).optional(),
  beginDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
};

// Criando o objeto de filtros utilizando o esquema definido acima
const indexTransactionsObject = z.object(indexTransactionSchema);
export type indexTransactionsDTO = z.infer<typeof indexTransactionsObject>;
