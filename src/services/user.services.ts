import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app.error";
import { UserRepository } from "../database/repositories/user.repository";
import { CreateUserDTO } from "../dtos/user.dtos";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt"

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create({ name, email, password, confirmPassword }: CreateUserDTO): Promise<User> {
    // Verifica se o usuário já existe com o mesmo e-mail
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("User already exists.", StatusCodes.BAD_REQUEST);
    }

   // Verifica se a senha e a confirmação de senha coincidem
   if (password !== confirmPassword) {
    throw new AppError("Password and confirm password do not match", StatusCodes.BAD_REQUEST);
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

 
    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
    });

    // Salva o usuário no banco de dados
    const createdUser = await this.userRepository.create(newUser);

    return createdUser;
  }
  
}
