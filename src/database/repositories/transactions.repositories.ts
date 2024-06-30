import {
  Transaction,
  TransactionType,
} from "../../entities/transactions.entity";
import { TransactionModel } from "../schemas/transactions.schema";
import {
  GetDashboardDTO,
  GetFinancialEvolutionDTO,
  indexTransactionsDTO,
} from "../../dtos/transactions.dto";
import { Balance } from "../../entities/balance.entity";
import { Expense } from "../../entities/expense.entities";

export class TransactionsRepository {
  constructor(private model: typeof TransactionModel) {}

  async create({
    userId,
    title,
    date,
    amount,
    type,
    observation,
    category,
  }: Transaction & { userId: string }): Promise<Transaction> {
    const createdTransaction = await this.model.create({
      userId,
      title,
      date,
      amount,
      type,
      observation,
      category,
    });

    return createdTransaction.toObject<Transaction>();
  }

  // Método para buscar transações com base nos parâmetros fornecidos
  async index({
    userId,
    title,
    categoryId,
    beginDate,
    endDate,
  }: indexTransactionsDTO & { userId: string }): Promise<Transaction[]> {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    //parâmetros de busca dinamicamente com base nos filtros fornecidos
    const whereParams: Record<string, unknown> = {
      userId,
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
    const transactions = await this.model.find(whereParams, undefined, {
      sort: { data: -1 },
    });
    // Convertendo as transações encontradas para objetos TypeScript
    const transactionMap = transactions.map((item) =>
      item.toObject<Transaction>()
    );

    return transactionMap;
  }

  // Buscar a transação pelo ID no banco de dados
  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await this.model.findById(id);

      if (!transaction) {
        return null;
      }

      const transactionObject = transaction.toObject<Transaction>();

      return transactionObject;
    } catch (error) {
      console.error("Error fetching transaction:", error); // Adicionando log de erro
      return null;
    }
  }

  async getBalance(
    userId: string,
    { beginDate, endDate }: GetDashboardDTO
  ): Promise<Balance> {
    const aggregate = this.model.aggregate<Balance>();

    // objeto de filtro inicial com o userId
    const matchParams: Record<string, unknown> = { userId };

    // data ao filtro, se forem fornecidas
    if (beginDate || endDate) {
      aggregate.match({
        date: {
          ...(beginDate && { $gte: beginDate }),
          ...(endDate && { $lte: endDate }),
        },
      });
    }
    // filtro na etapa de agregação
    aggregate.match(matchParams);

    const [result] = await aggregate

      .project({
        _id: 0,
        income: {
          $cond: [
            {
              $eq: ["$type", "income"],
            },
            "$amount",
            0,
          ],
        },
        expense: {
          $cond: [
            {
              $eq: ["$type", "expense"],
            },
            "$amount",
            0,
          ],
        },
      })
      .group({
        _id: null,
        incomes: {
          $sum: "$income",
        },
        expenses: {
          $sum: "$expense",
        },
      })
      .addFields({
        balance: {
          $subtract: ["$incomes", "$expenses"],
        },
      });

    return result;
  }

  async getExpenses({
    userId,
    beginDate,
    endDate,
  }: GetDashboardDTO & { userId: string }): Promise<Expense[]> {
    const aggregate = this.model.aggregate<Expense>();

    const matchParams: Record<string, unknown> = {
      userId,
      type: TransactionType.EXPENSE,
    };
    // Adicionar data ao filtro, se forem fornecidas
    if (beginDate || endDate) {
      matchParams.date = {
        ...(beginDate && { $gte: beginDate }),
        ...(endDate && { $lte: endDate }),
      };
    }
    const result = await aggregate.match(matchParams).group({
      _id: "$category._id",
      title: {
        $first: "$category.title",
      },
      color: {
        $first: "$category.color",
      },
      amount: {
        $sum: "$amount",
      },
    });
    return result;
  }

  async getFinancialEvolution({
    userId,
    year,
  }: GetFinancialEvolutionDTO): Promise<Balance[]> {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const aggregate = this.model.aggregate<Balance>();

    const result = await aggregate
      .match({
        userId,
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      })
      .project({
        _id: 0,
        income: {
          $cond: [
            {
              $eq: ["$type", "income"],
            },
            "$amount",
            0,
          ],
        },
        expense: {
          $cond: [
            {
              $eq: ["$type", "expense"],
            },
            "$amount",
            0,
          ],
        },
        year: {
          $year: "$date",
        },
        month: {
          $month: "$date",
        },
      })
      .group({
        _id: ["$year", "$month"],
        incomes: {
          $sum: "$income",
        },
        expenses: {
          $sum: "$expense",
        },
      })
      .addFields({
        balance: {
          $subtract: ["$incomes", "$expenses"],
        },
      })
      .sort({
        _id: 1,
      });
 
    return result;
  }
}
