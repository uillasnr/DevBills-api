import { CategoriesRepository } from "../database/repositories/categories.repository";
import { TransactionsRepository } from "../database/repositories/transactions.repositories";
import {
  CreateTransactionDTO,
  GetDashboardDTO,
  GetFinancialEvolutionDTO,
  MonthlyReportDTO,
  MonthlyReportResultDTO,
  MonthlyReportTransactionDTO,
  indexTransactionsDTO,
} from "../dtos/transactions.dto";
import { Transaction } from "../entities/transactions.entity";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app.error";
import { Balance } from "../entities/balance.entity";
import { Expense } from "../entities/expense.entities";
import { sendEmail } from "./mailer";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
    observation,
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
      observation,
    });
    // Chamar o repositório para criar a transação no banco de dados
    const createdTransaction =
      await this.transactionsRepository.create(transaction);

    return createdTransaction;
  }
  // Método para buscar transações com base nos filtros fornecidos
  async index(
    filters: indexTransactionsDTO & { userId: string }
  ): Promise<Transaction[]> {
    // Chamar o repositório para buscar transações com base nos filtros
    const transaction = await this.transactionsRepository.index(filters);

    return transaction;
  }

  // Chamar o repositório para buscar a transação pelo ID
  async getTransactionById(
    id: string,
    userId: string
  ): Promise<Transaction | null> {
    try {
      if (!userId) {
        throw new Error("User ID is required.");
      }

      const transaction =
        await this.transactionsRepository.getTransactionById(id);
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction by ID:", error);
      return null;
    }
  }

  async getDashboard({
    userId,
    beginDate,
    endDate,
  }: GetDashboardDTO & { userId: string }): Promise<{
    balance: Balance;
    expenses: Expense[];
  }> {
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

  async getFinancialEvolution({
    userId,
    year,
  }: GetFinancialEvolutionDTO): Promise<Balance[]> {
    if (!userId) {
      throw new AppError("User ID is required.", StatusCodes.BAD_REQUEST);
    }
    const financialEvolution =
      await this.transactionsRepository.getFinancialEvolution({ userId, year });

    return financialEvolution;
  }

  async getMonthlyExpenseReport({
    userId,
    month,
    year,
    email,
  }: MonthlyReportDTO & {
    userId: string;
    month: number;
    year: number;
    email: string;
  }): Promise<MonthlyReportResultDTO> {
    try {
      const transactions =
        await this.transactionsRepository.getTransactionsByMonthYear({
          userId,
          month,
          year,
        });

      const incomes: MonthlyReportTransactionDTO[] = [];
      const expenses: MonthlyReportTransactionDTO[] = [];

      transactions.forEach((transaction) => {
        const formattedTransaction: MonthlyReportTransactionDTO = {
          date: transaction.date,
          title: transaction.title,
          category: transaction.category.title,
          amount: transaction.amount,
          type: transaction.type,
        };

        // Separar as transações em receitas e despesas com base no tipo
        if (transaction.type === "income") {
          incomes.push(formattedTransaction);
        } else if (transaction.type === "expense") {
          expenses.push(formattedTransaction);
        }
      });

      // Calcular o total de receitas somando os valores de todas as transações de receitas
      const totalIncome = incomes.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      // Calcular o total de despesas somando os valores de todas as transações de despesas
      const totalExpense = expenses.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      // Função para formatar a data
      function formatDate(date: Date): string {
        return dayjs.utc(date).local().format('DD/MM/YYYY'); // Converte para o horário local antes de formatar
      }
      
console.log("formato da data",formatDate)
      function formatCurrency(value: number) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value / 100);
      }

      // Gerando HTML para o e-mail com os dados do relatório
      const htmlContent = `
        <html>
         <head>
          <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f5f5f5;
                padding: 20px;
              }
              h1 {
                color: #333;
                text-align: center;
                padding-bottom: 15px;
              }
              .summary {
                display: flex;
                justify-content: space-between; /* Alinha os elementos ao redor */
                align-items: center;
                margin-bottom: 20px;
                background-color: #fff;
                padding: 0px 60px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .summary img {
                width: 20%;
                height: auto;
                margin-right: 10px;
              }
              .summary p {
                font-size: 18px;
                margin-bottom: 5px;
                font-weight: bold;
              }
              .summary ul {
                list-style-type: none;
                padding: 0;
                display: flex;
                flex-direction: column;
              }
              .summary ul li {
                margin-right: 20px; 
                font-size: 16px;
              }
              .colorIncome {
                color: #009000; 
              }
              .colorExpense {
                color: #FF0000; 
              }
              ul {
                list-style-type: none;
                padding: 0;
              }
              ul li {
                margin-bottom: 2px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              table, th, td {
                border: 1px solid #ddd;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .category-heading {
                margin-top: 20px;
              }
      </style>
    </head>
    <body>
      <h1>Relatório Mensal de Despesas - ${formatDate(new Date())}</h1>
      <div class="summary">
       <img src="https://img.freepik.com/fotos-gratis/close-up-em-objetos-de-educacao-e-economia_23-2149113525.jpg" alt="Ícone de Resumo" />
       
       <ul>
           <p>Resumo:</p>
            <li>Receitas Totais: <span class='colorIncome'>${formatCurrency(
              totalIncome
            )}</span></li>
            <li>Despesas Totais: <span class='colorExpense'>${formatCurrency(
              totalExpense
            )}</span></li>
           </ul>
      </div>

      <div class="category-heading">
        <h2>Despesas por Categoria</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Título</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${expenses
              .map(
                (expense) => `
                <tr>
                  <td>${formatDate(expense.date)}</td>
                  <td>${expense.title}</td>
                  <td>${expense.category}</td>
                  <td>${formatCurrency(expense.amount)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="category-heading">
        <h2>Receitas por Categoria</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Título</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${incomes
              .map(
                (income) => `
                <tr>
                  <td>${formatDate(income.date)}</td>
                  <td>${income.title}</td>
                  <td>${income.category}</td>
                 <td>${formatCurrency(income.amount)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </body>
  </html>
`;

      // Enviar e-mail com o relatório mensal de despesas
      await sendEmail(email, "Relatório Mensal de Despesas", htmlContent);

      return {
        incomes,
        expenses,
        totalIncome,
        totalExpense,
      };
    } catch (error) {
      console.error("Error fetching monthly expense report:", error);

      throw new AppError(
        "Failed to fetch monthly expense report",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
