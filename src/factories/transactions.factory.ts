import { CategoriesRepository } from "../database/repositories/categories.repository";
import { TransactionsRepository } from "../database/repositories/transactions.repositories";
import { CategoryModel } from "../database/schemas/category.schema";
import { TransactionModel } from "../database/schemas/transactions.schema";
import { TransactionsService } from "../services/transactions.service";

export class TransactionsFactory {
  private static transactionsService: TransactionsService;

  static getServicesInstance() {
    if (this.transactionsService) {
      return this.transactionsService;
    }

    const repository = new TransactionsRepository(TransactionModel);
    const categoriesRepository = new CategoriesRepository(CategoryModel);
    const services = new TransactionsService(repository, categoriesRepository);

    this.transactionsService = services;

    return services;
  }
}
