import { NextFunction, Request, Response } from "express";
import { CategoriesService } from "../services/categories.services";
import { CreateCategoryDTO } from "../dtos/categories.dtos";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest, BodyRequest } from "./types";

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  create = async (
    req: BodyRequest<CreateCategoryDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {userId, title, Icon, color } = req.body;

      const result = await this.categoriesService.create({
        userId,
        title,
        Icon,
        color,
      });

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  index = async (req: AuthenticatedRequest<unknown>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await this.categoriesService.index(userId);
  
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
