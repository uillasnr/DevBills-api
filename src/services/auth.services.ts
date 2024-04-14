
import { UserRepository } from "../database/repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app.error";
import { StatusCodes } from "http-status-codes";
import { LoginUserDTO } from "../dtos/user.dtos";
import { User } from "../entities/user.entity";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async Login({ email, password }: LoginUserDTO): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Verifica se o usuário já existe com o mesmo e-mail
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found.", StatusCodes.BAD_REQUEST);
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("invalid password", StatusCodes.UNAUTHORIZED);
    }

    // Gera um token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1D",
    });

   // Retorna o usuário (sem a senha) 
   const userWithoutPassword: Omit<User, 'password'> = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  return { user: userWithoutPassword, token };
  }
}
