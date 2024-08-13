import { Router } from "express";
import { ParamsType, validator } from "../middleware/validator.middleware";
import {
  createTransactionsSchema,
  getDashboardSchema,
  getFinancialEvolutionSchema,
  indexTransactionSchema,
  monthlyReportSchema,
  updateTransactionsSchema,
} from "../dtos/transactions.dto";
import { TransactionsController } from "../Controllers/transactions.controller";
import { TransactionsFactory } from "../factories/transactions.factory";
import authMiddleware from "../middleware/auth.middleware";

export const TransactionsRoutes = Router();
const controller = new TransactionsController(
  TransactionsFactory.getServicesInstance()
);

TransactionsRoutes.post(
  "/",
  authMiddleware,
  validator({
    schema: createTransactionsSchema,
    type: ParamsType.BODY,
  }),
  controller.create
);

TransactionsRoutes.get(
  "/",
  authMiddleware,
  validator({
    schema: indexTransactionSchema,
    type: ParamsType.BODY,
  }),
  controller.index
);

TransactionsRoutes.put(
  "/:id",
  authMiddleware,
  validator({
    schema: updateTransactionsSchema,
    type: ParamsType.QUERY,
  }),
  controller.update
);

TransactionsRoutes.get(
  "/getTransaction/:id",
  authMiddleware,
  validator({
    schema: indexTransactionSchema,
    type: ParamsType.QUERY,
  }),
  controller.getTransactionById
);

TransactionsRoutes.get(
  "/deshboard",
  authMiddleware,
  validator({
    schema: getDashboardSchema,
    type: ParamsType.QUERY,
  }),
  controller.getDashBoard
);

TransactionsRoutes.get(
  "/financial-evolution",
  authMiddleware,
  validator({
    schema: getFinancialEvolutionSchema,
    type: ParamsType.QUERY,
  }),
  controller.getFinancialEvolution
);

TransactionsRoutes.get(
  "/monthly-report/",
  authMiddleware,
  validator({
    schema: monthlyReportSchema,
    type: ParamsType.QUERY,
  }),
  controller.getMonthlyReport
);
