import { UserRepository } from "../database/repositories/user.repository";
import { UserModel } from "../database/schemas/user.schema";
import { AuthService } from "../services/auth.services";

export class AuthFactory {
  private static AuthService: AuthService;

  static getInstance() {
    if (this.AuthService) {
      return this.AuthService;
    }

    const repository = new UserRepository(UserModel); 
    const service = new AuthService(repository);

    this.AuthService = service;

    return service;
  }
}
