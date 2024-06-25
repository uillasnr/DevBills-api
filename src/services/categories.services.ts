import { CategoriesRepository } from "../database/repositories/categories.repository";
import { CreateCategoryDTO } from "../dtos/categories.dtos";
import { StatusCodes } from "http-status-codes";
import { Category } from "../entities/category.entity";
import { AppError } from "../errors/app.error";

export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async create({
    userId,
    title,
    Icon,
    color,
  }: CreateCategoryDTO): Promise<Category> {
    const foundCategory = await this.categoriesRepository.findByTitle(userId, title);

    if (foundCategory) {
      throw new AppError("Category already exists.", StatusCodes.BAD_REQUEST);
    }
    const category = new Category({
      userId,
      title,
      Icon,
      color,
    });

    const createdCategory = await this.categoriesRepository.create(category);

    return createdCategory;
  }

  async index(userId: string): Promise<Category[]> {
    const Categories = await this.categoriesRepository.index(userId);

    return Categories;
  }
}
