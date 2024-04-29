import { z } from "zod";
import { TransactionType } from "../entities/transactions.entity";

// Definindo o esquema para a criação de transações
export const createTransactionsSchema = {
  userId: z.string().length(24), // Adicionando o campo userId
  title: z.string(),
  amount: z.number().int().positive(),
  type: z.nativeEnum(TransactionType),
  observation: z.string().optional(),
  date: z.coerce.date(),
  categoryId: z.string().length(24),
};

// Criando o objeto de transação utilizando o esquema definido acima
const createTransactionObject = z.object(createTransactionsSchema);
export type CreateTransactionDTO = z.infer<typeof createTransactionObject>;

// Definindo o esquema para os filtros na busca de transações
export const indexTransactionSchema = {
  userId: z.string().length(24).optional(),
  title: z.string().optional(),
  categoryId: z.string().length(24).optional(),
  beginDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
};

// Criando o objeto de filtros utilizando o esquema definido acima
const indexTransactionsObject = z.object(indexTransactionSchema);
export type indexTransactionsDTO = z.infer<typeof indexTransactionsObject>;

export const getDashboardSchema = {
  userId: z.string().length(24).optional(),
  beginDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
};

const getDashboardObject = z.object(getDashboardSchema);
export type GetDashboardDTO = z.infer<typeof getDashboardObject>;

export const getFinancialEvolutionSchema = {
  userId: z.string().length(24).optional(),
  year: z.string(),
};
const getFinancialEvolutionObject = z.object(getFinancialEvolutionSchema);
export type GetFinancialEvolutionDTO = z.infer<typeof getFinancialEvolutionObject>;

export const getTransactionByIdSchema = {
  id: z.string(), 
};

const getTransactionByIdObject = z.object(getTransactionByIdSchema);
export type GetTransactionByIdDTO = z.infer<typeof getTransactionByIdObject>;