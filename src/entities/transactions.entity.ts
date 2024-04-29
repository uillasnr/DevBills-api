import { Category } from "./category.entity";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

type TransactionProps = {
  _id?: string;
  userId: string;
  title: string;
  amount: number;
  date: Date;
  category: Category;
  type: TransactionType;
  observation?: string;
};

export class Transaction {
  public _id?: string;
  public userId: string;
  public title: string;
  public amount: number;
  public date: Date;
  public category: Category;
  public type: TransactionType;
  public observation?: string;

  constructor({
    _id,
    userId,
    title,
    type,
    date,
    amount,
    category,
    observation,
  }: TransactionProps) {
    this._id = _id;
    this.userId = userId;
    this.title = title;
    this.amount = amount;
    this.date = new Date(date);
    this.category = new Category(category);
    this.type = type;
    this.observation = observation;
  }
}
