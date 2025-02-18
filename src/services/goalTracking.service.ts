import {
  GoalTracking,
  GoalTrackingProps,
} from "../entities/goalTracking.entities";

import { AppError } from "../errors/app.error";
import { StatusCodes } from "http-status-codes";
import { GoalTrackingRepository } from "../database/repositories/goalTracking.repository";
import {
  CreateGoalTrackingDTO,
  UpdateGoalTrackingDTO,
} from "../dtos/goalTracking.dto";

export class GoalTrackingService {
  constructor(private goalTrackingRepository: GoalTrackingRepository) {}

  async create({
    userId,
    name,
    currentAmount,
    targetAmount,
    deadline,
  }: CreateGoalTrackingDTO & { userId: string }): Promise<GoalTrackingProps> {

    if (!userId) {
      throw new AppError("User ID is required.", StatusCodes.BAD_REQUEST);
    }
    
    const goalTracking = await this.goalTrackingRepository.create({
      userId,
      name,
      currentAmount,
      targetAmount,
      deadline,
    });
    return goalTracking;
  }

  async index(userId: string): Promise<GoalTracking[]> {
    return await this.goalTrackingRepository.index(userId);
  }

  async update(
    userId: string,
    id: string,
    updateData: UpdateGoalTrackingDTO
  ): Promise<GoalTracking> {
    const goal = await this.goalTrackingRepository.findById(id);

    if (!goal) {
      throw new AppError("Goal not found", StatusCodes.NOT_FOUND);
    }

    if (goal.userId !== userId) {
      throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const updatedGoal = await this.goalTrackingRepository.update(
      userId,
      id,
      updateData
    );

    if (!updatedGoal) {
      throw new AppError(
        "Error updating goal",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return updatedGoal;
  }

  async delete(userId: string, id: string): Promise<void> {
    const deleted = await this.goalTrackingRepository.delete(userId, id);

    if (!deleted) {
      throw new AppError("Goal not found", StatusCodes.NOT_FOUND);
    }
  }
}
