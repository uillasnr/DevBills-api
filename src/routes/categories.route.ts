import { Router } from "express";
import { CategoriesController } from "../Controllers/Categories.controller";
import { ParamsType, validator } from "../middleware/validator.middleware";
import { createCategorySchema } from "../dtos/categories.dtos";

export const CategoriesRoutes = Router();
const controller = new CategoriesController();

CategoriesRoutes.post(
  "/",
  validator({
    schema: createCategorySchema,
    type: ParamsType.BODY,
  }),
  controller.create
);

CategoriesRoutes.get("/", controller.index);