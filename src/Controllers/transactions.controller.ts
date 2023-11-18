import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionsService } from "../services/transactions.service";
import { CreateTransactionDTO } from "../dtos/transactions.dto";

export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  create = async (
    req: Request<unknown, unknown, CreateTransactionDTO>,
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

  /*   index = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.transactionsService.index();

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }; */
}
