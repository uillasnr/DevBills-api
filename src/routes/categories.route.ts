import { Router } from "express";
import { CategoriesController } from "../Controllers/Categories.controller";
import { ParamsType, validator } from "../middleware/validator.middleware";
import { createCategorySchema } from "../dtos/categories.dtos";
import { CategoriesFactory } from "../factories/categories.factory";
import authMiddleware from "../middleware/auth.middleware";

export const CategoriesRoutes = Router();
const controller = new CategoriesController(
  CategoriesFactory.getServicesInstance()
);

CategoriesRoutes.post(
  "/",
  authMiddleware,
  validator({
    schema: createCategorySchema,
    type: ParamsType.BODY,
  }),
  controller.create
);

CategoriesRoutes.get("/", authMiddleware,controller.index);
