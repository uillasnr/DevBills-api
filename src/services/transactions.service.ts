import { CategoriesRepository } from "../database/repositories/categories.repository";
import { TransactionsRepository } from "../database/repositories/transactions.repositories";
import {
  CreateTransactionDTO,
  indexTransactionsDTO,
} from "../dtos/transactions.dto";
import { Transaction } from "../entities/transactions.entity";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app.error";

export class TransactionsService {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categorisRepository: CategoriesRepository
  ) {}

  async create({
    title,
    date,
    amount,
    type,
    categoryId,
  }: CreateTransactionDTO): Promise<Transaction> {
    //precisa validar se a categoria existe
    const category = await this.categorisRepository.findById(categoryId);

    if (!category) {
      throw new AppError("Category does not exists.", StatusCodes.NOT_FOUND);
    }
    // Criar uma nova transação com base nos parâmetros fornecidos
    const transaction = new Transaction({
      title,
      date,
      amount,
      type,
      category,
    });
    // Chamar o repositório para criar a transação no banco de dados
    const createdTransaction =
      await this.transactionsRepository.create(transaction);

    return createdTransaction;
  }
  // Método para buscar transações com base nos filtros fornecidos
  async index(filters: indexTransactionsDTO): Promise<Transaction[]> {
    // Chamar o repositório para buscar transações com base nos filtros
    const transaction = await this.transactionsRepository.index(filters);

    return transaction;
  }
}
