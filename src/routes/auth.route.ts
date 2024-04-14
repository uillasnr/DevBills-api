import { Router } from "express";

import { ParamsType, validator } from "../middleware/validator.middleware";
import { LoginUserSchema} from "../dtos/user.dtos";
import { AuthController } from "../Controllers/auth.controller";
import { AuthFactory } from "../factories/auth.factory";

export const AuthRoutes = Router();
const controller = new AuthController(
  AuthFactory.getInstance()
);

AuthRoutes.post(
  "/",
  validator({
    schema: LoginUserSchema,
    type: ParamsType.BODY,
  }),
  controller.create
);


