import { Router } from "express";

import { ParamsType, validator } from "../middleware/validator.middleware";
import { createUserSchema } from "../dtos/user.dtos";
import { UserFactory } from "../factories/user.factory";
import { UserController } from "../Controllers/user.controller";

export const UserRoutes = Router();
const controller = new UserController(
  UserFactory.getInstance()
);

UserRoutes.post(
  "/",
  validator({
    schema: createUserSchema,
    type: ParamsType.BODY,
  }),
  controller.create
);


