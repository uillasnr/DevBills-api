import { GoalTracking } from "../../entities/goalTracking.entities";
import { GoalTrackingModel } from "../schemas/goalTracking.schema";

export class GoalTrackingRepository {
  constructor(private model: typeof GoalTrackingModel) {}

  async create({ userId, name, currentAmount, targetAmount, deadline }: GoalTracking): Promise<GoalTracking>{
    const createdGoal = await this.model.create({ userId, name, currentAmount, targetAmount, deadline });
    return createdGoal.toObject<GoalTracking>();
  }

  async index(userId: string): Promise<GoalTracking[]> {
    const goals = await this.model.find({ userId }).sort({ deadline: 1 });
    return goals.map((goal) => goal.toObject<GoalTracking>());
  }

  async findById(id: string): Promise<GoalTracking | null> {
    const goal = await this.model.findById(id);
    return goal ? goal.toObject<GoalTracking>() : null;
  }

  async update(userId: string, id: string, updateData: Partial<GoalTracking>): Promise<GoalTracking | null> {
    const goal = await this.model.findOneAndUpdate(
      { _id: id, userId }, 
      updateData, 
      { new: true }
    );

    return goal ? goal.toObject<GoalTracking>() : null;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}
