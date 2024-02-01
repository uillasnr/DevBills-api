import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionsService } from "../services/transactions.service";
import {
  CreateTransactionDTO,
  GetDashboardDTO,
  GetFinancialEvolutionDTO,
  indexTransactionsDTO,
} from "../dtos/transactions.dto";
import { BodyRequest, QueryRequest } from "./types";

export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  create = async (
    req: BodyRequest<CreateTransactionDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { title, amount, categoryId, date, type } = req.body;

      const result = await this.transactionsService.create({
        title,
        amount,
        categoryId,
        date,
        type,
      });

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  //lidar com a busca de transações com base em filtros
  index = async (
    req: QueryRequest<indexTransactionsDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { title, categoryId, beginDate, endDate } = req.query;
      // Chamar o serviço para buscar transações com base nos filtros fornecidos
      const result = await this.transactionsService.index({
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

  // Buscar detalhes de uma transação pelo ID
  getTransactionDetails = async (
    req: Request<{ id: string }>, 
    res: Response,
    next: NextFunction
) => {
    try {
        const id  = req.params.id; 

        // Chamar o serviço para buscar os detalhes da transação pelo ID
        const transactionDetails = await this.transactionsService.getTransactionById(id);

        console.log("Detalhes da transação encontrados:", transactionDetails);

        return res.status(StatusCodes.OK).json(transactionDetails);
    } catch (error) {
        console.error("Erro ao buscar detalhes da transação pelo ID:", error);
        next(error);
    }
};

  getDashBoard = async (
    req: QueryRequest<GetDashboardDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { beginDate, endDate } = req.query;
      // Chamar o serviço para buscar transações com base nos filtros fornecidos
      const result = await this.transactionsService.getDashboard({
        beginDate,
        endDate,
      });

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getFinancialEvolution = async (
    req: QueryRequest< GetFinancialEvolutionDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { year } = req.query;

      const result = await this.transactionsService.getFinancialEvolution({
        year,
      });

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
