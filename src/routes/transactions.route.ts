import { Router } from "express";
import { ParamsType, validator } from "../middleware/validator.middleware";
import {
  createTransactionsSchema,
  getDashboardSchema,
  getFinancialEvolutionSchema,
  getTransactionByIdSchema,
  indexTransactionSchema,
} from "../dtos/transactions.dto";
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

TransactionsRoutes.get(
  "/",
  validator({
    schema: indexTransactionSchema,
    type: ParamsType.BODY,
  }),
  controller.index
);

TransactionsRoutes.get(
  "/deshboard",
  validator({
    schema: getDashboardSchema,
    type: ParamsType.BODY,
  }),
  controller.getDashBoard
);

TransactionsRoutes.get(
  "/financial-evolution",
  validator({
    schema: getFinancialEvolutionSchema,
    type: ParamsType.QUERY,
  }),
  controller.getFinancialEvolution
);

TransactionsRoutes.get(
  "/:id",
  validator({
    schema: getTransactionByIdSchema, // Valide os parâmetros da solicitação
    type: ParamsType.PARAMS,
  }),
  controller.getTransactionDetails
);
