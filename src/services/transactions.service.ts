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
    userId,
    title,
    date,
    amount,
    type,
    categoryId,
  }: CreateTransactionDTO & { userId: string }): Promise<Transaction> {
    
    if (!userId) {
      throw new AppError("User ID is required.", StatusCodes.BAD_REQUEST);
    }
    //precisa validar se a categoria existe
    const category = await this.categorisRepository.findById(categoryId);

    if (!category) {
      throw new AppError("Category does not exists.", StatusCodes.NOT_FOUND);
    }
    // Criar uma nova transação com base nos parâmetros fornecidos
    const transaction = new Transaction({
      userId,
      title,
      date,
      amount,
      type,
      category,
    });
    // Chamar o repositório para criar a transação no banco de dados
    const createdTransaction = await this.transactionsRepository.create(transaction);

    return createdTransaction;
  }
  // Método para buscar transações com base nos filtros fornecidos
  async index(filters: indexTransactionsDTO & { userId: string }): Promise<Transaction[]> {
    // Chamar o repositório para buscar transações com base nos filtros
    const transaction = await this.transactionsRepository.index(filters);

    return transaction;
  }

  // Chamar o repositório para buscar a transação pelo ID
  async getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    try {

      if (!userId) {
        throw new Error("User ID is required.");
      }

      const transaction = await this.transactionsRepository.getTransactionById(id);
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      return null;
    }
  }

  async getDashboard({
    userId,
    beginDate,
    endDate,
  }: GetDashboardDTO & { userId: string }): Promise<{ balance: Balance; expenses: Expense[] }> {
    if (!userId) {
      throw new Error("User ID is required.");
    }
  
    // Obter o saldo e as despesas assíncronamente, passando o userId para garantir que apenas os dados do usuário logado sejam recuperados
    let [balance, expenses] = await Promise.all([
      this.transactionsRepository.getBalance(userId, { beginDate, endDate }),
      this.transactionsRepository.getExpenses({ userId, beginDate, endDate }),
    ]);
 
    // Se o saldo não estiver definido, inicializá-lo com valores padrão
    if (!balance) {
      balance = new Balance({
        _id: userId,
        incomes: 0,
        expenses: 0,
        balance: 0,
      });
    }
  
    return { balance, expenses };
  }
  

  async getFinancialEvolution({userId, year }: GetFinancialEvolutionDTO ):  Promise<Balance[]> {
    if (!userId) {
      throw new AppError("User ID is required.", StatusCodes.BAD_REQUEST);
    } 
    const financialEvolution =
      await this.transactionsRepository.getFinancialEvolution({userId, year });
console.log("serfice:",year,financialEvolution)
    return financialEvolution;
  }
}
