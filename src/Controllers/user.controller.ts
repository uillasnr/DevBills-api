import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BodyRequest } from "./types";
import { CreateUserDTO } from "../dtos/user.dtos";
import { UserService } from "../services/user.services";

export class UserController {
  constructor(private userService: UserService) {}

  create = async (
    req: BodyRequest<CreateUserDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Verifica se a senha e a confirmação de senha coincidem
      if (password !== confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Password and confirm password do not match",
        });
      }

      const result = await this.userService.create({
        name,
        email,
        password,
        confirmPassword
      });

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };
}
