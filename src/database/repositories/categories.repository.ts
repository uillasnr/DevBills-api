import { Category } from "../../entities/category.entity";
import { CategoryModel } from "../schemas/category.schema";

export class CategoriesRepository {
  constructor(private model: typeof CategoryModel) {}

  async create({ title, Icon, color }: Category): Promise<Category> {
    const createdCategory = await this.model.create({ title, Icon, color });

    return createdCategory.toObject<Category>();
  }

  //Categorias pelo titlo
  async findByTitle(title: string): Promise<Category | undefined> {
    const category = await this.model.findOne({ title });

    return category?.toObject<Category>();
  }

  async findById(id: string): Promise<Category | undefined> {
    const category = await this.model.findById(id);

    return category?.toObject<Category>();
  }

  async index(): Promise<Category[]> {
    const categorias = await this.model.find();

    const categoriesMap = categorias.map((item) => item.toObject<Category>());

    return categoriesMap;
  }
}
