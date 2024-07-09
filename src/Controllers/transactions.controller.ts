import { NextFunction, Request, Response, query } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionsService } from "../services/transactions.service";
import {
  CreateTransactionDTO,
  GetDashboardDTO,
  GetFinancialEvolutionDTO,
  MonthlyReportDTO,
  indexTransactionsDTO,
} from "../dtos/transactions.dto";
import { AuthenticatedRequest, BodyRequest, QueryRequest } from "./types";

export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  create = async (
    req: BodyRequest<CreateTransactionDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId, title, amount, categoryId, date, type, observation } =
        req.body;

      const result = await this.transactionsService.create({
        userId: userId,
        title,
        amount,
        categoryId,
        date,
        type,
        observation,
      });

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  //lidar com a busca de transações com base em filtros
  index = async (
    req: QueryRequest<indexTransactionsDTO> & AuthenticatedRequest<unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { title, categoryId, beginDate, endDate } = req.query;

      // Chamar o serviço para buscar transações com base nos filtros fornecidos
      const result = await this.transactionsService.index({
        userId,
        title,
        categoryId,
        beginDate,
        endDate,
      });

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };


  getDashBoard = async (
    req: QueryRequest<GetDashboardDTO> & AuthenticatedRequest<unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { beginDate, endDate } = req.query;

      const result = await this.transactionsService.getDashboard({
        userId,
        beginDate,
        endDate,
      });

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getFinancialEvolution = async (
    req: QueryRequest<GetFinancialEvolutionDTO> & AuthenticatedRequest<unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { year } = req.query;

      const result = await this.transactionsService.getFinancialEvolution({
        userId,
        year,
      });

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMonthlyReport = async (
    req: QueryRequest<MonthlyReportDTO> & AuthenticatedRequest<unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { month, year } = req.query;

      const result = await this.transactionsService.getMonthlyExpenseReport({
        userId,
        month: Number(month),
        year: Number(year),
      });

     return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
