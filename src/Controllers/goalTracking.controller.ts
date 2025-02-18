import { NextFunction,  Response } from "express";
import { StatusCodes } from "http-status-codes";
import { GoalTrackingService } from "../services/goalTracking.service";
import { AuthenticatedRequest } from "./types";
import { CreateGoalTrackingDTO } from "../dtos/goalTracking.dto";

export class GoalTrackingController {
  constructor(private goalTrackingService: GoalTrackingService) {}

  async create(
    req:AuthenticatedRequest<CreateGoalTrackingDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthenticated user" });
      }

      const { name, currentAmount, targetAmount, deadline } = req.body;

      const result = await this.goalTrackingService.create({
        userId: req.user.id,
        name,
        currentAmount,
        targetAmount,
        deadline,
      });

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async index(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthenticated user" });
      }

      const result = await this.goalTrackingService.index(req.user.id);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthenticated user" });
      }

      const { id } = req.params;
      const updateData = req.body;

      const result = await this.goalTrackingService.update(req.user.id, id, updateData);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthenticated user" });
      }

      const { id } = req.params;
      await this.goalTrackingService.delete(req.user.id, id);
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
