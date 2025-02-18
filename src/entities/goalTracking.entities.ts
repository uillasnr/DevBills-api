export type GoalTrackingProps = {
  _id?: string;
  userId: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  deadline: Date;
 
};

export class GoalTracking {
  public _id?: string;
  public userId: string;
  public name: string;
  public currentAmount: number;
  public targetAmount: number;
  public deadline: Date;
 

  constructor({
    _id,
    userId,
    name,
    currentAmount,
    targetAmount,
    deadline,
   
  }: GoalTrackingProps) {
    this._id = _id;
    this.userId = userId;
    this.name = name;
    this.currentAmount = currentAmount;
    this.targetAmount = targetAmount;
    this.deadline = new Date(deadline);
   
  }
}
