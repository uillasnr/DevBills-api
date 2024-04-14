import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BodyRequest } from "./types";

import { LoginUserDTO } from "../dtos/user.dtos";
import { AuthService } from "../services/auth.services";

export class AuthController {
  constructor(private AuthService: AuthService) {}

  create = async (
    req: BodyRequest<LoginUserDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      const { user, token } = await this.AuthService.Login({ email, password });

      return res.status(StatusCodes.CREATED).json({ user, token });
    } catch (error) {
      next(error);
    }
  };
}
