
import { GoalTrackingRepository } from "../database/repositories/goalTracking.repository";
import { GoalTrackingModel } from "../database/schemas/goalTracking.schema";
import { GoalTrackingService } from "../services/goalTracking.service";

export class GoalTrackingFactory {
  private static goalTrackingService: GoalTrackingService | null = null; 

  static getServicesInstance() {
    if (this.goalTrackingService) {
      return this.goalTrackingService;
    }

    const repository = new GoalTrackingRepository(GoalTrackingModel);
    this.goalTrackingService = new GoalTrackingService(repository); 

    return this.goalTrackingService;
  }
}
