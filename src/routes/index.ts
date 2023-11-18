import { Router } from "express";
import { baseRoutes } from "./base.route";
import { CategoriesRoutes } from "./categories.route";
import { TransactionsRoutes } from "./transactions.route";

export const routes = Router();

routes.use("/", baseRoutes);
routes.use("/categories", CategoriesRoutes);
routes.use("/transactions", TransactionsRoutes);
