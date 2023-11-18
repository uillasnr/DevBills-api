import { Router } from "express";
import { ParamsType, validator } from "../middleware/validator.middleware";
import { createTransactionsSchema } from "../dtos/transactions.dto";
import { TransactionsController } from "../Controllers/transactions.controller";
import { TransactionsFactory } from "../factories/transactions.factory";

export const TransactionsRoutes = Router();
const controller = new TransactionsController(
  TransactionsFactory.getServicesInstance()
);

TransactionsRoutes.post(
  "/",
  validator({
    schema: createTransactionsSchema,
    type: ParamsType.BODY,
  }),
  controller.create
);

TransactionsRoutes.get("/", controller.index);
