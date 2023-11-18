import { CategoriesRepository } from "../database/repositories/categories.repository";
import { TransactionsRepository } from "../database/repositories/transactions.repositories";
import { CreateTransactionDTO } from "../dtos/transactions.dto";
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

    const transaction = new Transaction({
      title,
      date,
      amount,
      type,
      category,
    });

    const createdTransaction =
      await this.transactionsRepository.create(transaction);

    return createdTransaction;
  }
}
