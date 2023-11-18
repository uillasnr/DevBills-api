import { CategoryModel } from "../database/schemas/category.schema";
import { CategoriesRepository } from "../database/repositories/categories.repository";
import { CategoriesService } from "../services/categories.services";

export class CategoriesFactory {
  private static categoriesService: CategoriesService;

  static getServicesInstance() {
    if (this.categoriesService) {
      return this.categoriesService;
    }

    const repository = new CategoriesRepository(CategoryModel);
    const services = new CategoriesService(repository);

    this.categoriesService = services;

    return services;
  }
}
