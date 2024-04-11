import { UserModel } from "../database/schemas/user.schema";
import { UserRepository } from "../database/repositories/user.repository";
import { UserService } from "../services/user.services";


export class UserFactory {
  private static userService: UserService;

  static getInstance() {
    if (this.userService) {
      return this.userService;
    }

    const repository = new UserRepository(UserModel);
    const service = new UserService(repository);

    this.userService = service;

    return service;
  }
}
