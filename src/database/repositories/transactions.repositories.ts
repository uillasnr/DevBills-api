import { Transaction } from "../../entities/transactions.entity";
import { TransactionModel } from "../schemas/transactions.schema";
import { indexTransactionsDTO } from "../../dtos/transactions.dto";

export class TransactionsRepository {
  constructor(private model: typeof TransactionModel) {}

  async create({
    title,
    date,
    amount,
    type,
    category,
  }: Transaction): Promise<Transaction> {
    const createdTransaction = await this.model.create({
      title,
      date,
      amount,
      type,
      category,
    });

    return createdTransaction.toObject<Transaction>();
  }

  // Método para buscar transações com base nos parâmetros fornecidos
  async index({
    title,
    categoryId,
    beginDate,
    endDate,
  }: indexTransactionsDTO): Promise<Transaction[]> {
    //parâmetros de busca dinamicamente com base nos filtros fornecidos
    const whereParams: Record<string, unknown> = {
      ...(title && { title: { $regex: title, $options: "i" } }),
      ...(categoryId && { "category._id": categoryId }),
    };

    if (beginDate || endDate) {
      whereParams.date = {
        ...(beginDate && { $gte: beginDate }),
        ...(endDate && { $lte: endDate }),
      };
    }
    // Realizando a busca no banco de dados com base nos parâmetros construídos
    const transactions = await this.model.find(whereParams);
    // Convertendo as transações encontradas para objetos TypeScript
    const transactionMap = transactions.map((item) =>
      item.toObject<Transaction>()
    );

    return transactionMap;
  }
}
