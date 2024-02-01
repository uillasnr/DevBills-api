import { CategoriesRepository } from "../database/repositories/categories.repository";
import { TransactionsRepository } from "../database/repositories/transactions.repositories";
import {
  CreateTransactionDTO,
  GetDashboardDTO,
  GetFinancialEvolutionDTO,
  indexTransactionsDTO,
} from "../dtos/transactions.dto";
import { Transaction } from "../entities/transactions.entity";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app.error";
import { Balance } from "../entities/balance.entity";
import { Expense } from "../entities/expense.entities";

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

  // Chamar o repositório para buscar a transação pelo ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await this.transactionsRepository.getTransactionById(id);
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      return null;
    }
  }

  async getDashboard({
    beginDate,
    endDate,
  }: GetDashboardDTO): Promise<{ balance: Balance; expenses: Expense[] }> {
    // Obter o saldo e as despesas assíncronamente
    let [balance, expenses] = await Promise.all([
      this.transactionsRepository.getBalance({
        beginDate,
        endDate,
      }),
      this.transactionsRepository.getExpenses({
        beginDate,
        endDate,
      }),
    ]);
    // Se o saldo não estiver definido, inicializá-lo com valores padrão
    if (!balance) {
      balance = new Balance({
        _id: null,
        incomes: 0,
        expenses: 0,
        balance: 0,
      });
    }
    return { balance, expenses };
  }

  async getFinancialEvolution({
    year,
  }: GetFinancialEvolutionDTO): Promise<Balance[]> {
    const financialEvolution =
      await this.transactionsRepository.getFinancialEvolution({ year });

    return financialEvolution;
  }
}
