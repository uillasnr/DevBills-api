import { NextFunction, Request, Response } from "express";
import { CategoriesService } from "../services/categories.services";
import { CategoriesRepository } from "../database/schemas/repositories/categories.repository";
import { CategoryModel } from "../database/schemas/category.schema";
import { CreateCategoryDTO } from "../dtos/categories.dtos";
import { StatusCodes } from "http-status-codes";

export class CategoriesController {
  async create(
    req: Request<unknown, unknown, CreateCategoryDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, color } = req.body;

      const respository = new CategoriesRepository(CategoryModel);
      const service = new CategoriesService(respository);

      const result = await service.create({ title, color });

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const respository = new CategoriesRepository(CategoryModel);
      const service = new CategoriesService(respository);

      const result = await service.index();

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
