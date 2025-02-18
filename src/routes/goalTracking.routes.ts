import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware";
import { GoalTrackingController } from "../Controllers/goalTracking.controller";
import { GoalTrackingFactory } from "../factories/goalTracking.factory";

export const goalTrackingRouter = Router();

const controller = new GoalTrackingController(
    GoalTrackingFactory.getServicesInstance()
)

goalTrackingRouter.post("/criar", authMiddleware, controller.create.bind(controller))
goalTrackingRouter.get("/buscar", authMiddleware, controller.index.bind(controller));
goalTrackingRouter.put("/:id", authMiddleware, controller.update.bind(controller));
goalTrackingRouter.delete("/excluir/:id", authMiddleware, controller.delete.bind(controller));
